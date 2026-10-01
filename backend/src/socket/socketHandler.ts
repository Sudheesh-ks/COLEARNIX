import { Server, Socket } from 'socket.io';
import User from '../models/userModel';
import { IRoomService } from '../services/interface/IRoomService';
import { verifyAccessToken } from '../utils/jwt.utils';

const whiteboardHistory: { [roomId: string]: any[] } = {};
const codeHistory: { [roomId: string]: string } = {};
const codeLanguage: { [roomId: string]: string } = {};

export const setupSocketHandlers = (io: Server, roomService: IRoomService) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (typeof token !== 'string') {
        next(new Error('Authentication required'));
        return;
      }

      const decoded = verifyAccessToken(token);
      if (decoded.role !== 'user') {
        next(new Error('Room access is restricted to users'));
        return;
      }

      const user = await User.findById(decoded.id);
      if (!user || user.isBlocked) {
        next(new Error('User is not authorized'));
        return;
      }

      socket.data.userId = user._id.toString();
      socket.data.userName = user.name || 'Student';
      next();
    } catch {
      next(new Error('Invalid or expired access token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId as string;
    const name = socket.data.userName as string;
    console.log('User connected:', userId);

    const hasRoomAccess = async (roomId: string): Promise<boolean> => {
      if (typeof roomId !== 'string' || !socket.rooms.has(roomId)) {
        return false;
      }

      try {
        const isParticipant = await roomService.isActiveParticipant(roomId, userId);
        if (!isParticipant) {
          socket.leave(roomId);
          socket.emit('room-error', 'You are no longer a participant in this room.');
        }
        return isParticipant;
      } catch (error) {
        console.error('Socket room access check failed:', error);
        return false;
      }
    };

    socket.on('join-room', async (roomId: string, state: any) => {
      try {
        if (!await roomService.isActiveParticipant(roomId, userId)) {
          socket.emit('room-error', 'Join by entering the code.');
          return;
        }

        socket.join(roomId);
        console.log(`User ${userId} (${name}) joined room ${roomId}`);

        socket.to(roomId).emit('user-joined', { userId, name, state });

        if (whiteboardHistory[roomId]) {
          socket.emit('whiteboard-history', whiteboardHistory[roomId]);
        }

        if (codeHistory[roomId] !== undefined) {
          socket.emit('code-history', {
            code: codeHistory[roomId],
            language: codeLanguage[roomId] || 'javascript'
          });
        }
      } catch (error) {
        console.error('Socket room join failed:', error);
        socket.emit('room-error', 'Could not verify access to this room.');
      }
    });

    socket.on('offer', async (data: { roomId: string; offer: any; to: string; from: string; name: string; state: any }) => {
      if (await hasRoomAccess(data.roomId)) {
        socket.to(data.roomId).emit('offer', { ...data, from: userId, name });
      }
    });

    socket.on('answer', async (data: { roomId: string; answer: any; to: string; from: string; name: string; state: any }) => {
      if (await hasRoomAccess(data.roomId)) {
        socket.to(data.roomId).emit('answer', { ...data, from: userId, name });
      }
    });

    socket.on('ice-candidate', async (data: { roomId: string; candidate: any; to: string; from: string }) => {
      if (await hasRoomAccess(data.roomId)) {
        socket.to(data.roomId).emit('ice-candidate', { ...data, from: userId });
      }
    });

    socket.on('toggle-media', async (data: { roomId: string; userId: string; type: 'mic' | 'camera'; enabled: boolean }) => {
      if (await hasRoomAccess(data.roomId)) {
        socket.to(data.roomId).emit('toggle-media', { ...data, userId });
      }
    });

    socket.on('whiteboard-draw', async (data: { roomId: string; drawData: any }) => {
      if (!await hasRoomAccess(data.roomId)) return;
      if (!whiteboardHistory[data.roomId]) {
        whiteboardHistory[data.roomId] = [];
      }
      whiteboardHistory[data.roomId].push({ type: 'draw', ...data.drawData });
      socket.to(data.roomId).emit('whiteboard-draw', data.drawData);
    });

    socket.on('whiteboard-clear', async (roomId: string) => {
      if (!await hasRoomAccess(roomId)) return;
      whiteboardHistory[roomId] = [];
      socket.to(roomId).emit('whiteboard-clear');
    });

    socket.on('code-sync', async (data: { roomId: string; code: string }) => {
      if (!await hasRoomAccess(data.roomId)) return;
      codeHistory[data.roomId] = data.code;
      socket.to(data.roomId).emit('code-sync', data.code);
    });

    socket.on('code-language-sync', async (data: { roomId: string; language: string }) => {
      if (!await hasRoomAccess(data.roomId)) return;
      codeLanguage[data.roomId] = data.language;
      socket.to(data.roomId).emit('code-language-sync', data.language);
    });

    socket.on('code-output-sync', async (data: { roomId: string; output: string }) => {
      if (!await hasRoomAccess(data.roomId)) return;
      socket.to(data.roomId).emit('code-output-sync', data.output);
    });

    socket.on('disconnecting', () => {
      const rooms = Array.from(socket.rooms);
      rooms.filter(roomId => roomId !== socket.id).forEach(roomId => {
        socket.to(roomId).emit('user-left', userId);
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
