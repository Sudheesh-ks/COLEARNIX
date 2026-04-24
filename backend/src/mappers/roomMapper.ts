import { RoomDTO } from '../dtos/room.dto';
import { IRoom } from '../models/roomModel';

export const toRoomDTO = (r: IRoom): RoomDTO => {
  return {
    _id: (r._id as any).toString(),
    roomId: r.roomId,
    hostId: r.hostId,
    pax: r.pax,
    participants: r.participants,
    isActive: r.isActive,
    createdAt: r.createdAt,
  };
};
