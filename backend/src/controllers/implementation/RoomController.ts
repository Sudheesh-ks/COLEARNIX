import { Request, Response } from 'express';
import { IRoomController } from '../interface/IRoomController';
import { IRoomService } from '../../services/interface/IRoomService';
import { HttpStatus } from '../../constants/status.constants';

export class RoomController implements IRoomController {
  constructor(private readonly _roomService: IRoomService) {}

  async createRoom(req: Request, res: Response): Promise<void> {
    try {
      const { pax } = req.body;
      const hostId = (req as any).userId; // Assumes authMiddleware sets this
      const room = await this._roomService.createRoom(hostId, pax);

      res.status(HttpStatus.OK).json({
        success: true,
        data: room
      });
    } catch (error: any) {
      console.error('Create room error:', error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Failed to create room'
      });
    }
  }

  async getRoom(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params as { roomId: string };
      const room = await this._roomService.getRoom(roomId);

      if (!room) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Room not found'
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        data: room
      });
    } catch (error: any) {
      console.error('Get room error:', error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Failed to fetch room'
      });
    }
  }

  async joinRoom(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params as { roomId: string };
      const userId = (req as any).userId;
      const room = await this._roomService.joinRoom(roomId, userId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: room
      });
    } catch (error: any) {
      console.error('Join room error:', error.message);
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message || 'Failed to join room'
      });
    }
  }

  async leaveRoom(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params as { roomId: string };
      const userId = (req as any).userId;
      await this._roomService.leaveRoom(roomId, userId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Left room successfully'
      });
    } catch (error: any) {
      console.error('Leave room error:', error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Failed to leave room'
      });
    }
  }
}
