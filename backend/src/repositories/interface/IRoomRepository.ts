import { IRoom } from '../../models/roomModel';

export interface IRoomRepository {
  create(data: Partial<IRoom>): Promise<IRoom>;
  findByRoomId(roomId: string): Promise<IRoom | null>;
  updateByRoomId(roomId: string, data: Partial<IRoom>): Promise<IRoom | null>;
  deleteByRoomId(roomId: string): Promise<boolean>;
}
