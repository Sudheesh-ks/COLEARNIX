import { RoomDTO } from "../../dtos/room.dto";

export interface IRoomService {
  createRoom(hostId: string, pax: number): Promise<RoomDTO>;
  getRoom(roomId: string): Promise<RoomDTO | null>;
  joinRoom(roomId: string, userId: string): Promise<RoomDTO>;
  leaveRoom(roomId: string, userId: string): Promise<void>;
  executeCode(language: string, version: string, code: string): Promise<any>;
}
