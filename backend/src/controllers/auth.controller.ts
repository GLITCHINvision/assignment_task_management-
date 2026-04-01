import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name } = req.body;
      const { user, accessToken, refreshToken } = await this.authService.register({ email, password, name });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name },
        accessToken,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await this.authService.login(email, password);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name },
        accessToken,
      });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'Refresh token missing.' });
      }

      const { accessToken, refreshToken: newRefreshToken } = await this.authService.refresh(refreshToken);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        accessToken,
      });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  };

  logout = async (req: any, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        await this.authService.logout(req.user.id);
      }
      res.clearCookie('refreshToken');
      res.status(200).json({ success: true, message: 'Logged out successfully.' });
    } catch (error: any) {
      next(error);
    }
  };

  getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const user = await (this.authService as any).getUserProfile(userId);
      res.status(200).json({ success: true, user });
    } catch (error: any) {
      next(error);
    }
  };
}
