import express from 'express';
import { roomController } from '../dependencyHandlers/room.dependencies';
import authRole from '../middlewares/authMiddleware';

const roomRouter = express.Router();

roomRouter.use(authRole(['user']));

roomRouter.post('/create', roomController.createRoom.bind(roomController));
roomRouter.get('/:roomId', roomController.getRoom.bind(roomController));
roomRouter.post('/:roomId/join', roomController.joinRoom.bind(roomController));
roomRouter.post('/:roomId/leave', roomController.leaveRoom.bind(roomController));
roomRouter.post('/execute', roomController.executeCode.bind(roomController));

export default roomRouter;
