import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  CHAT_SOCKET_C_MESSAGE,
  CHAT_SOCKET_S_MESSAGE,
  SOCKET_S_GLOBAL,
} from '@lib/common';
export interface PACKET {
  eventName: string;
}

export class C_SEND_MESSAGE implements PACKET {
  eventName = CHAT_SOCKET_C_MESSAGE.C_SEND_MESSAGE;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  nickName: string;
}

export class S_SEND_MESSAGE implements PACKET {
  eventName = CHAT_SOCKET_S_MESSAGE.S_SEND_MESSAGE;

  sendNickname: string;
  message: string;
}

export class C_SEND_DIRECT_MESSAGE implements PACKET {
  eventName = CHAT_SOCKET_C_MESSAGE.C_SEND_DIRECT_MESSAGE;

  @IsString()
  @IsNotEmpty()
  recvNickname: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsOptional()
  roomCode: string | null;

  @IsString()
  @IsOptional()
  roomName: string | null;
}

export class S_SEND_DIRECT_MESSAGE implements PACKET {
  eventName = CHAT_SOCKET_S_MESSAGE.S_SEND_DIRECT_MESSAGE;

  sendNickname: string;
  recvNickname: string;
  message: string;
  color: string;
}

export class C_ENTER implements PACKET {
  eventName = CHAT_SOCKET_C_MESSAGE.C_ENTER;

  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class S_ENTER implements PACKET {
  eventName = CHAT_SOCKET_S_MESSAGE.S_ENTER;
  result: object;
}

export class S_USER_CONNECTED implements PACKET {
  eventName = SOCKET_S_GLOBAL.S_USER_CONNECTED;
  userId: string;
  cleintId: string;
}
