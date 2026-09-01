import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { registerSchema, loginSchema, verifyEmailSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/auth';
import { prisma } from '../prisma/client';

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const user = await AuthService.register(validatedData);

      res.status(201).json({
        success: true,
        message: 'Registration successful. Verification OTP sent to your email/phone.',
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const result = await AuthService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ success: false, message: 'Refresh token is required' });
      }

      const tokens = await AuthService.refresh(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: tokens,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = verifyEmailSchema.parse(req.body);
      await AuthService.verifyEmail(email, otp);

      res.status(200).json({
        success: true,
        message: 'Email verified successfully. Your account is now active.',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      const token = await AuthService.forgotPassword(email);

      res.status(200).json({
        success: true,
        message: 'Password reset link sent to your email.',
        // For development purposes, we can include the token, in production we send via email
        data: process.env.NODE_ENV === 'development' ? { token } : undefined,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = resetPasswordSchema.parse(req.body);
      await AuthService.resetPassword(token, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password reset successful. You can now login with your new password.',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          studentProfile: {
            include: {
              course: true,
              currentSemester: true,
            },
          },
          facultyProfile: {
            include: {
              department: true,
              subjects: true,
            },
          },
          parentProfile: {
            include: {
              students: {
                include: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const { passwordHash, emailVerifyOTP, resetToken, ...userWithoutSensitiveData } = user;

      res.status(200).json({
        success: true,
        data: userWithoutSensitiveData,
      });
    } catch (err) {
      next(err);
    }
  }
}
