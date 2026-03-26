import { Request, Response } from 'express';
import { IAdminController } from '../interface/IAdminController';
import { IAdminService } from '../../services/interface/IAdminService';
import { HttpStatus } from '../../constants/status.constants';

export class AdminController implements IAdminController {
  constructor(private _adminService: IAdminService) { }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { admin, accessToken, refreshToken } = await this._adminService.login(email, password);

      res.cookie('refreshToken_admin', refreshToken, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: 'lax',
        path: '/',
        maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Login successful',
        data: { admin, token: accessToken },
      });
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message || 'Login failed',
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie('refreshToken_admin', {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: 'lax',
        path: '/',
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Logout failed',
      });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken_admin;
      const { token, refreshToken: newRefreshToken } = await this._adminService.refreshToken(refreshToken);

      res.cookie('refreshToken_admin', newRefreshToken, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: 'lax',
        path: '/',
        maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        token,
      });
    } catch (error: any) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: error.message || 'Token refresh failed',
      });
    }
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { users, total } = await this._adminService.getUsers(page, limit);

      res.status(HttpStatus.OK).json({
        success: true,
        data: { users, total },
      });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Failed to fetch users',
      });
    }
  }

  async toggleBlockUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params as { userId: string };
      const updatedUser = await this._adminService.toggleBlockUser(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: `User ${updatedUser.isBlocked ? 'blocked' : 'unblocked'} successfully`,
        data: updatedUser,
      });
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message || 'Failed to toggle user status',
      });
    }
  }
}
