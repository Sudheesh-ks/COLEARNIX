import { IRoomRepository } from '../interface/IRoomRepository';
import Room, { IRoom } from '../../models/roomModel';

export class RoomRepository implements IRoomRepository {
  async create(data: Partial<IRoom>): Promise<IRoom> {
    const room = new Room(data);
    return await room.save();
  }

  async findByRoomId(roomId: string): Promise<IRoom | null> {
    return await Room.findOne({ roomId, isActive: true });
  }

  async updateByRoomId(roomId: string, data: Partial<IRoom>): Promise<IRoom | null> {
    return await Room.findOneAndUpdate({ roomId }, { $set: data }, { new: true });
  }

  async deleteByRoomId(roomId: string): Promise<boolean> {
    const result = await Room.deleteOne({ roomId });
    return result.deletedCount > 0;
  }
}
