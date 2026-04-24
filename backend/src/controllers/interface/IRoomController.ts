import { Request, Response } from 'express';

export interface IRoomController {
  createRoom(req: Request, res: Response): Promise<void>;
  getRoom(req: Request, res: Response): Promise<void>;
  joinRoom(req: Request, res: Response): Promise<void>;
  leaveRoom(req: Request, res: Response): Promise<void>;
  executeCode(req: Request, res: Response): Promise<void>;
}
