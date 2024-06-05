import { Socket } from 'socket.io';

interface SocketData {
  userId: string;
  clientId: string;
  jwtAccessToken: string;
  nickname: string;
  roomId: string;
  roomName: string;
  socketId: string;
}

export interface CustomSocket extends Socket {
  data: SocketData;
}
