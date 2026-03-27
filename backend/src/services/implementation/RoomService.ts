import { IRoomService } from '../interface/IRoomService';
import { IRoomRepository } from '../../repositories/interface/IRoomRepository';
import { IRoom } from '../../models/roomModel';
// import { v4 as uuidv4 } from 'uuid'; // I'll use a simpler generator to match the dummy one

function generateRoomId() {
  const s = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${s()}-${s()}-${s()}`;
}

export class RoomService implements IRoomService {
  constructor(private readonly _roomRepository: IRoomRepository) {}

  async createRoom(hostId: string, pax: number): Promise<IRoom> {
    const roomId = generateRoomId();
    return await this._roomRepository.create({
      roomId,
      hostId,
      pax,
      participants: [hostId],
      isActive: true
    });
  }

  async getRoom(roomId: string): Promise<IRoom | null> {
    return await this._roomRepository.findByRoomId(roomId);
  }

  async joinRoom(roomId: string, userId: string): Promise<IRoom> {
    const room = await this._roomRepository.findByRoomId(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.participants.includes(userId)) {
      return room;
    }

    if (room.participants.length >= room.pax) {
      throw new Error('Room is full');
    }

    room.participants.push(userId);
    const updatedRoom = await this._roomRepository.updateByRoomId(roomId, {
      participants: room.participants
    });

    if (!updatedRoom) {
      throw new Error('Failed to join room');
    }

    return updatedRoom;
  }

  async leaveRoom(roomId: string, userId: string): Promise<void> {
    const room = await this._roomRepository.findByRoomId(roomId);
    if (!room) return;

    const participants = room.participants.filter(id => id !== userId);
    
    if (participants.length === 0) {
        // Option: de-activate room if empty
        await this._roomRepository.updateByRoomId(roomId, { participants, isActive: false });
    } else {
        await this._roomRepository.updateByRoomId(roomId, { participants });
    }
  }
}
