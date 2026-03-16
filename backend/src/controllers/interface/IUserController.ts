import { Request, Response } from 'express';

export interface IUserController {
  refreshToken(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
}
