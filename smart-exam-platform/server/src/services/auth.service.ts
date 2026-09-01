import { prisma } from '../prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Role, User, UserStatus } from '@prisma/client';
import { BadRequestError, UnauthorizedError, ConflictError, NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'supersecretaccesskey123';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'supersecretrefreshkey456';
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Register a new user
   */
  public static async register(data: any): Promise<User> {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
        status: UserStatus.PENDING,
        isEmailVerified: false,
        emailVerifyOTP: otp,
        otpExpiry,
      },
    });

    // Simulate sending OTP (would trigger Email/SMS Notification service in a real app)
    logger.info(`Verification OTP for ${user.email} is: ${otp}`);
    
    // Auto-create profile shell depending on role
    if (data.role === Role.STUDENT) {
      // Create student profile requires course and semester, we default/allow setting in admin update
      // For seed or fast demo, let's create a minimal student profile if courseId and currentSemesterId are available
      if (data.courseId && data.currentSemesterId) {
        await prisma.student.create({
          data: {
            userId: user.id,
            rollNumber: `ROLL-${Date.now()}`,
            registrationNumber: `REG-${Date.now()}`,
            admissionYear: new Date().getFullYear(),
            courseId: data.courseId,
            currentSemesterId: data.currentSemesterId,
          },
        });
      }
    } else if (data.role === Role.FACULTY) {
      if (data.departmentId && data.designation) {
        await prisma.faculty.create({
          data: {
            userId: user.id,
            departmentId: data.departmentId,
            designation: data.designation,
          },
        });
      }
    }

    return user;
  }

  /**
   * Log in user
   */
  public static async login(email: string, password: string): Promise<{ user: Omit<User, 'passwordHash'>; tokens: AuthTokens }> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.status === UserStatus.SUSPENDED || user.status === UserStatus.INACTIVE) {
      throw new BadRequestError('Your account has been deactivated or suspended');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokens = await this.generateTokens(user.id, user.role);

    const { passwordHash, emailVerifyOTP, resetToken, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword as any,
      tokens,
    };
  }

  /**
   * Refresh the access token
   */
  public static async refresh(token: string): Promise<AuthTokens> {
    try {
      const decoded = jwt.verify(token, REFRESH_SECRET) as { userId: string; role: Role };
      
      const storedToken = await prisma.refreshToken.findFirst({
        where: {
          token,
          userId: decoded.userId,
          expiresAt: { gte: new Date() },
        },
      });

      if (!storedToken) {
        throw new UnauthorizedError('Invalid or expired refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(decoded.userId, decoded.role);

      // Delete old token
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });

      return tokens;
    } catch (err) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  /**
   * Log out user (revoke refresh token)
   */
  public static async logout(token: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token },
    });
  }

  /**
   * Verify email via OTP
   */
  public static async verifyEmail(email: string, otp: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestError('Email is already verified');
    }

    if (!user.emailVerifyOTP || user.emailVerifyOTP !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      throw new BadRequestError('Invalid or expired OTP');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        status: UserStatus.ACTIVE,
        emailVerifyOTP: null,
        otpExpiry: null,
      },
    });
  }

  /**
   * Initiate forgot password flow (generates a token)
   */
  public static async forgotPassword(email: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundError('No account found with this email');
    }

    const resetToken = jwt.sign({ userId: user.id }, ACCESS_SECRET, { expiresIn: '1h' });
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // In production, send email. For now, return token.
    logger.info(`Reset token for ${user.email} is: ${resetToken}`);
    return resetToken;
  }

  /**
   * Reset Password
   */
  public static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, ACCESS_SECRET) as { userId: string };
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
          resetToken: token,
          resetTokenExpiry: { gte: new Date() },
        },
      });

      if (!user) {
        throw new BadRequestError('Invalid or expired reset token');
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });
    } catch (err) {
      throw new BadRequestError('Invalid or expired reset token');
    }
  }

  /**
   * Helper to generate Access and Refresh tokens
   */
  private static async generateTokens(userId: string, role: Role): Promise<AuthTokens> {
    const accessToken = jwt.sign({ userId, role }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY as any });
    const refreshToken = jwt.sign({ userId, role }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY as any });

    // Store refresh token
    const expiryDays = parseInt(REFRESH_EXPIRY.replace('d', '')) || 7;
    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }
}
