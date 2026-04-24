import { IRoomService } from '../interface/IRoomService';
import { IRoomRepository } from '../../repositories/interface/IRoomRepository';
import { RoomDTO } from '../../dtos/room.dto';
import { toRoomDTO } from '../../mappers/roomMapper';

function generateRoomId() {
  const s = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${s()}-${s()}-${s()}`;
}

export class RoomService implements IRoomService {
  constructor(private readonly _roomRepository: IRoomRepository) {}

  async createRoom(hostId: string, pax: number): Promise<RoomDTO> {
    const roomId = generateRoomId();
    const room = await this._roomRepository.create({
      roomId,
      hostId,
      pax,
      participants: [hostId],
      isActive: true
    });
    return toRoomDTO(room);
  }

  async getRoom(roomId: string): Promise<RoomDTO | null> {
    const room = await this._roomRepository.findByRoomId(roomId);
    return room ? toRoomDTO(room) : null;
  }

  async joinRoom(roomId: string, userId: string): Promise<RoomDTO> {
    const room = await this._roomRepository.findByRoomId(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.participants.includes(userId)) {
      return toRoomDTO(room);
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

    return toRoomDTO(updatedRoom);
  }

  async leaveRoom(roomId: string, userId: string): Promise<void> {
    const room = await this._roomRepository.findByRoomId(roomId);
    if (!room) return;

    const participants = room.participants.filter(id => id !== userId);
    
    if (participants.length === 0) {
        await this._roomRepository.updateByRoomId(roomId, { participants, isActive: false });
    } else {
        await this._roomRepository.updateByRoomId(roomId, { participants });
    }
  }

  async executeCode(language: string, version: string, code: string): Promise<any> {
    try {
      const JUDGE0_LANG_MAP: Record<string, number> = {
        "javascript": 63,
        "typescript": 74,
        "python": 71,
        "java": 62,
        "cpp": 54
      };

      const languageId = JUDGE0_LANG_MAP[language.toLowerCase()];
      if (!languageId) {
        throw new Error(`Language ${language} is not supported by the current execution engine.`);
      }

      const response = await fetch("https://ce.judge0.com/submissions?wait=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin: ""
        })
      });

      const result = await response.json();
      
      return {
        run: {
          stdout: result.stdout,
          stderr: result.stderr || result.compile_output || result.message,
          code: result.status?.id === 3 ? 0 : 1,
          signal: null
        },
        language,
        version
      };
    } catch (error: any) {
      console.error('Execute code error:', error.message);
      throw new Error('Failed to connect to execution engine');
    }
  }
}
