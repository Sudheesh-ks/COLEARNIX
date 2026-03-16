import { Request, Response } from 'express';
import { IUserController } from '../interface/IUserController';
import { IUserService } from '../../services/interface/IUserService';
import { HttpStatus } from '../../constants/status.constants';

export class UserController implements IUserController {
  constructor(private readonly _userService: IUserService) { }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { token, refreshToken } = await this._userService.refreshToken(
        req.cookies?.refreshToken_user
      );

      res.cookie('refreshToken_user', refreshToken, {
        httpOnly: true,
        secure: false, 
        sameSite: 'lax',
        path: '/',
        maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Tokens refreshed successfully',
        token,
      });
    } catch (error: any) {
      console.error('Refresh token error:', error.message);
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: error.message || 'Unauthorized',
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie('refreshToken_user', {
        httpOnly: true,
        secure: false, 
        sameSite: 'lax',
        path: '/',
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error: any) {
      console.error('Logout error:', error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to logout',
      });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const profile = await this._userService.getProfile(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: profile
      });
    } catch (error: any) {
      console.error('Get profile error:', error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Failed to fetch profile'
      });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const updatedProfile = await this._userService.updateProfile(userId, req.body);

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile
      });
    } catch (error: any) {
      console.error('Update profile error:', error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Failed to update profile'
      });
    }
  }
}
