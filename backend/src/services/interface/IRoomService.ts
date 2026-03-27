import { IRoom } from '../../models/roomModel';

export interface IRoomService {
  createRoom(hostId: string, pax: number): Promise<IRoom>;
  getRoom(roomId: string): Promise<IRoom | null>;
  joinRoom(roomId: string, userId: string): Promise<IRoom>;
  leaveRoom(roomId: string, userId: string): Promise<void>;
}
