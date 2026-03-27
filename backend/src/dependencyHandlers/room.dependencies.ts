import { RoomRepository } from '../repositories/implementation/RoomRepository';
import { RoomService } from '../services/implementation/RoomService';
import { RoomController } from '../controllers/implementation/RoomController';

const roomRepository = new RoomRepository();
const roomService = new RoomService(roomRepository);

export const roomController = new RoomController(roomService);
