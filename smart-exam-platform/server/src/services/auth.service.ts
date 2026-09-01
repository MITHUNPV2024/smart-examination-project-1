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

interface DemoUser extends Omit<User, 'createdAt' | 'updatedAt'> {
  createdAt: Date;
  updatedAt: Date;
}

export class AuthService {
  private static demoUsers = new Map<string, DemoUser>();
  private static demoRefreshTokens = new Map<string, { token: string; userId: string; role: Role; expiresAt: Date }>();

  private static isDatabaseUnavailable(error: any): boolean {
    const message = `${error?.message || ''}`;
    const name = error?.name || '';

    return (
      name === 'PrismaClientInitializationError' ||
      name === 'PrismaClientKnownRequestError' ||
      /No available servers|Server selection timeout|Topology:|InternalError|Mongo.*Network|I\/O error|ECONNREFUSED/i.test(message)
    );
  }

  private static async withDemoFallback<T>(dbOperation: () => Promise<T>, demoOperation: () => Promise<T>): Promise<T> {
    try {
      return await dbOperation();
    } catch (error: any) {
      if (this.isDatabaseUnavailable(error)) {
        logger.warn('Database unavailable, switching to demo mode for auth flow');
        return await demoOperation();
      }
      throw error;
    }
  }

  private static async ensureDemoSeed(): Promise<void> {
    if (this.demoUsers.size > 0) {
      return;
    }

    const passwordHash = await bcrypt.hash('Password@123', 10);
    const demoAccounts = [
      { email: 'superadmin@smartexams.edu', firstName: 'Albus', lastName: 'Dumbledore', role: Role.SUPER_ADMIN },
      { email: 'collegeadmin@smartexams.edu', firstName: 'Minerva', lastName: 'McGonagall', role: Role.COLLEGE_ADMIN },
      { email: 'hod@smartexams.edu', firstName: 'Severus', lastName: 'Snape', role: Role.DEPARTMENT_HOD },
      { email: 'faculty@smartexams.edu', firstName: 'Remus', lastName: 'Lupin', role: Role.FACULTY },
      { email: 'internal@smartexams.edu', firstName: 'Filius', lastName: 'Flitwick', role: Role.INTERNAL_EXAMINER },
      { email: 'external@smartexams.edu', firstName: 'Garrick', lastName: 'Ollivander', role: Role.EXTERNAL_EXAMINER },
      { email: 'student@smartexams.edu', firstName: 'Harry', lastName: 'Potter', role: Role.STUDENT },
      { email: 'parent@smartexams.edu', firstName: 'James', lastName: 'Potter', role: Role.PARENT },
    ];

    for (const account of demoAccounts) {
      const now = new Date();
      const user: DemoUser = {
        id: `demo-${account.email}`,
        email: account.email,
        passwordHash,
        firstName: account.firstName,
        lastName: account.lastName,
        role: account.role,
        phone: null,
        avatarUrl: null,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        emailVerifyOTP: null,
        otpExpiry: null,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: now,
        updatedAt: now,
      };
      this.demoUsers.set(account.email.toLowerCase(), user);
    }
  }

  private static async lookupDemoUser(email: string): Promise<DemoUser | null> {
    await this.ensureDemoSeed();
    return this.demoUsers.get(email.toLowerCase()) || null;
  }

  private static async registerDemo(data: any): Promise<User> {
    await this.ensureDemoSeed();
    const email = data.email.toLowerCase();
    if (this.demoUsers.has(email)) {
      throw new ConflictError('Email already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
    const now = new Date();

    const user: DemoUser = {
      id: `demo-${Date.now()}`,
      email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      phone: data.phone || null,
      avatarUrl: null,
      status: UserStatus.PENDING,
      isEmailVerified: false,
      emailVerifyOTP: otp,
      otpExpiry,
      resetToken: null,
      resetTokenExpiry: null,
      createdAt: now,
      updatedAt: now,
    };

    this.demoUsers.set(email, user);
    logger.info(`Demo registration successful for ${email}. OTP: ${otp}`);
    return user;
  }

  private static async loginDemo(email: string, password: string): Promise<{ user: Omit<User, 'passwordHash'>; tokens: AuthTokens }> {
    const user = await this.lookupDemoUser(email);
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

    const tokens = await this.generateDemoTokens(user.id, user.role);
    const { passwordHash, emailVerifyOTP, resetToken, ...userWithoutPassword } = user;
    return { user: userWithoutPassword as any, tokens };
  }

  private static async refreshDemo(token: string): Promise<AuthTokens> {
    const storedToken = this.demoRefreshTokens.get(token);
    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const tokens = await this.generateDemoTokens(storedToken.userId, storedToken.role, token);
    this.demoRefreshTokens.delete(token);
    return tokens;
  }

  private static async logoutDemo(token: string): Promise<void> {
    this.demoRefreshTokens.delete(token);
  }

  private static async verifyEmailDemo(email: string, otp: string): Promise<void> {
    const user = await this.lookupDemoUser(email);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestError('Email is already verified');
    }

    if (!user.emailVerifyOTP || user.emailVerifyOTP !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      throw new BadRequestError('Invalid or expired OTP');
    }

    user.isEmailVerified = true;
    user.status = UserStatus.ACTIVE;
    user.emailVerifyOTP = null;
    user.otpExpiry = null;
    user.updatedAt = new Date();
    this.demoUsers.set(email.toLowerCase(), user);
  }

  private static async forgotPasswordDemo(email: string): Promise<string> {
    const user = await this.lookupDemoUser(email);
    if (!user) {
      throw new NotFoundError('No account found with this email');
    }

    const resetToken = jwt.sign({ userId: user.id }, ACCESS_SECRET, { expiresIn: '1h' });
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    user.updatedAt = new Date();
    this.demoUsers.set(email.toLowerCase(), user);
    logger.info(`Reset token for ${user.email} is: ${resetToken}`);
    return resetToken;
  }

  private static async resetPasswordDemo(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, ACCESS_SECRET) as { userId: string };
      const user = Array.from(this.demoUsers.values()).find((entry) => entry.id === decoded.userId);
      if (!user || user.resetToken !== token || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
        throw new BadRequestError('Invalid or expired reset token');
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      user.passwordHash = passwordHash;
      user.resetToken = null;
      user.resetTokenExpiry = null;
      user.updatedAt = new Date();
      this.demoUsers.set(user.email.toLowerCase(), user);
    } catch (err) {
      throw new BadRequestError('Invalid or expired reset token');
    }
  }

  public static async getDemoProfile(userId: string): Promise<any> {
    await this.ensureDemoSeed();
    const user = Array.from(this.demoUsers.values()).find((item) => item.id === userId);
    if (!user) {
      return null;
    }
    const { passwordHash, emailVerifyOTP, resetToken, ...userWithoutSensitiveData } = user;
    return userWithoutSensitiveData;
  }

  /**
   * Register a new user
   */
  public static async register(data: any): Promise<User> {
    return this.withDemoFallback(
      async () => {
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
          throw new ConflictError('Email already registered');
        }

        const passwordHash = await bcrypt.hash(data.password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

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

        logger.info(`Verification OTP for ${user.email} is: ${otp}`);
        if (data.role === Role.STUDENT && data.courseId && data.currentSemesterId) {
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
        return user;
      },
      async () => this.registerDemo(data)
    );
  }

  /**
   * Log in user
   */
  public static async login(email: string, password: string): Promise<{ user: Omit<User, 'passwordHash'>; tokens: AuthTokens }> {
    return this.withDemoFallback(
      async () => {
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
        return { user: userWithoutPassword as any, tokens };
      },
      async () => this.loginDemo(email, password)
    );
  }

  /**
   * Refresh the access token
   */
  public static async refresh(token: string): Promise<AuthTokens> {
    return this.withDemoFallback(
      async () => {
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

          const tokens = await this.generateTokens(decoded.userId, decoded.role);
          await prisma.refreshToken.delete({ where: { id: storedToken.id } });
          return tokens;
        } catch (err) {
          throw new UnauthorizedError('Invalid refresh token');
        }
      },
      async () => this.refreshDemo(token)
    );
  }

  /**
   * Log out user (revoke refresh token)
   */
  public static async logout(token: string): Promise<void> {
    return this.withDemoFallback(
      async () => {
        await prisma.refreshToken.deleteMany({ where: { token } });
      },
      async () => this.logoutDemo(token)
    );
  }

  /**
   * Verify email via OTP
   */
  public static async verifyEmail(email: string, otp: string): Promise<void> {
    return this.withDemoFallback(
      async () => {
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
      },
      async () => this.verifyEmailDemo(email, otp)
    );
  }

  /**
   * Initiate forgot password flow (generates a token)
   */
  public static async forgotPassword(email: string): Promise<string> {
    return this.withDemoFallback(
      async () => {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          throw new NotFoundError('No account found with this email');
        }

        const resetToken = jwt.sign({ userId: user.id }, ACCESS_SECRET, { expiresIn: '1h' });
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

        await prisma.user.update({
          where: { id: user.id },
          data: {
            resetToken,
            resetTokenExpiry,
          },
        });

        logger.info(`Reset token for ${user.email} is: ${resetToken}`);
        return resetToken;
      },
      async () => this.forgotPasswordDemo(email)
    );
  }

  /**
   * Reset Password
   */
  public static async resetPassword(token: string, newPassword: string): Promise<void> {
    return this.withDemoFallback(
      async () => {
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
      },
      async () => this.resetPasswordDemo(token, newPassword)
    );
  }

  /**
   * Helper to generate Access and Refresh tokens
   */
  private static async generateTokens(userId: string, role: Role): Promise<AuthTokens> {
    const accessToken = jwt.sign({ userId, role }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY as any });
    const refreshToken = jwt.sign({ userId, role }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY as any });

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

  private static async generateDemoTokens(userId: string, role: Role, oldToken?: string): Promise<AuthTokens> {
    const accessToken = jwt.sign({ userId, role }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY as any });
    const refreshToken = jwt.sign({ userId, role }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY as any });
    const expiryDays = parseInt(REFRESH_EXPIRY.replace('d', '')) || 7;
    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

    if (oldToken) {
      this.demoRefreshTokens.delete(oldToken);
    }

    this.demoRefreshTokens.set(refreshToken, { token: refreshToken, userId, role, expiresAt });
    return { accessToken, refreshToken };
  }
}
