import { Server, Socket } from 'socket.io';

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', (roomId: string, userId: string, name: string, state: any) => {
      socket.join(roomId);
      console.log(`User ${userId} (${name}) joined room ${roomId}`);
      
      // Store user info on the socket
      (socket as any).userId = userId;

      // Notify others in the room
      socket.to(roomId).emit('user-joined', { userId, name, state });
    });

    socket.on('offer', (data: { roomId: string; offer: any; to: string; from: string; name: string; state: any }) => {
      socket.to(data.roomId).emit('offer', data);
    });

    socket.on('answer', (data: { roomId: string; answer: any; to: string; from: string; name: string; state: any }) => {
      socket.to(data.roomId).emit('answer', data);
    });

    socket.on('ice-candidate', (data: { roomId: string; candidate: any; to: string; from: string }) => {
      socket.to(data.roomId).emit('ice-candidate', data);
    });

    socket.on('toggle-media', (data: { roomId: string; userId: string; type: 'mic' | 'camera'; enabled: boolean }) => {
      socket.to(data.roomId).emit('toggle-media', data);
    });

    socket.on('disconnecting', () => {
      const rooms = Array.from(socket.rooms);
      const userId = (socket as any).userId;
      if (userId) {
        rooms.forEach(roomId => {
          socket.to(roomId).emit('user-left', userId);
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
