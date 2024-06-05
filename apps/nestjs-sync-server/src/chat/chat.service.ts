import { Inject, Injectable, Logger } from '@nestjs/common';
import { CustomSocket } from '../interfaces/custom-socket';
import { RequestPayload } from '../packets/packets.interface';
import {
  CHAT_SOCKET_C_MESSAGE,
  NATS_EVENTS,
  NatsMessageHandler,
  SOCKET_S_GLOBAL,
} from '@lib/common';
import {
  C_SEND_DIRECT_MESSAGE,
  C_SEND_MESSAGE,
  S_SEND_MESSAGE,
} from '../packets/packet';
import { Server } from 'socket.io';

@Injectable()
export class ChatService {
  constructor(private readonly messageHandler: NatsMessageHandler) {}

  private server: Server;
  setServer(server: Server) {
    this.server = server;
  }

  private readonly logger = new Logger(ChatService.name);

  async handleRequestMessage(client: CustomSocket, payload: RequestPayload) {
    switch (payload.eventName) {
      case CHAT_SOCKET_C_MESSAGE.C_SEND_MESSAGE:
        await this.sendMessage(client, payload.data);
        break;
      case CHAT_SOCKET_C_MESSAGE.C_SEND_DIRECT_MESSAGE:
        await this.sendDirectMessage(client, payload.data);
        break;
      default:
        this.logger.debug('잘못된 패킷 입니다.');
        client.emit(SOCKET_S_GLOBAL.ERROR, '잘못된 패킷 입니다.');
        break;
    }
  }

  async sendMessage(client: CustomSocket, packet: C_SEND_MESSAGE) {
    console.log('sendMessage: ', packet);
    const nickname = packet.nickName;

    const request = new S_SEND_MESSAGE();
    request.message = packet.message;
    request.sendNickname = nickname;

    const data = {
      roomId: client.data.roomId,
      packet: request,
    };

    console.log('data: ', data);
    await this.messageHandler.publishHandler(
      `${NATS_EVENTS.CHAT_ROOM}:${client.data.roomId}`,
      JSON.stringify(data),
    );
  }

  async sendDirectMessage(
    client: CustomSocket,
    packet: C_SEND_DIRECT_MESSAGE,
  ) {}

  async broadcastMessage(data) {
    console.log('채팅 브로드캐스트 : ', data);

    const roomId = data.roomId;
    const packet = data.packet;

    const { eventName, ...packetData } = packet;

    this.server.to(roomId).emit(eventName, JSON.stringify(packetData));
  }
}
