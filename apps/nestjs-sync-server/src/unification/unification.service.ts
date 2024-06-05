import { Injectable, Logger } from '@nestjs/common';
import { CustomSocket } from '../interfaces/custom-socket';
import { RequestPayload } from '../packets/packets.interface';
import {
  CHAT_SOCKET_C_MESSAGE,
  NATS_EVENTS,
  NatsMessageHandler,
  SOCKET_S_GLOBAL,
} from '@lib/common';
import { C_ENTER, S_ENTER, S_USER_CONNECTED } from '../packets/packet';
import { Server } from 'socket.io';
import { SubscribeService } from '../services/subscribe.service';

@Injectable()
export class UnificationService {
  constructor(
    private readonly subscribeService: SubscribeService,
    private messageHandler: NatsMessageHandler,
  ) {}
  private readonly logger = new Logger(UnificationService.name);

  private server: Server;
  setServer(server: Server) {
    this.server = server;
  }

  async handleConnection(server: Server, client: CustomSocket) {
    const result = new S_USER_CONNECTED();
    result.cleintId = client.id;

    client.emit(SOCKET_S_GLOBAL.S_USER_CONNECTED, result);
    this.logger.debug('접속 완료');
  }

  async handleRequestMessage(client: CustomSocket, payload: RequestPayload) {
    switch (payload.eventName) {
      case CHAT_SOCKET_C_MESSAGE.C_ENTER:
        await this.joinRoom(client, payload.data as C_ENTER);
        break;
    }
  }
  async joinRoom(client: CustomSocket, packet: C_ENTER) {
    this.logger.debug('💚💚 Join Room 💚💚');
    console.log(packet);

    const roomId = packet.roomId;
    const userId = client.data.userId;
    const clientId = client.id;

    client.data.userId = userId;
    client.data.roomId = roomId;
    client.data.clientId = clientId;

    client.join(roomId);

    await this.registerSubcribe(client.data.userId, roomId);

    const broadcastPacket = new S_ENTER();
    broadcastPacket.result = { roomId, clientId, userId };
    const broadcastData = {
      roomId,
      packet: broadcastPacket,
    };

    await this.messageHandler.publishHandler(
      `${NATS_EVENTS.CHAT_ROOM}:${roomId}`,
      JSON.stringify(broadcastData),
    );
  }

  async registerSubcribe(userId: string, roomId: string) {
    // 현재 채팅 룸 구독 여부 체크
    const isSubscribe = await this.messageHandler.getSubscribe(
      `${NATS_EVENTS.CHAT_ROOM}:${roomId}`,
    );

    if (!isSubscribe) {
      // 현재 룸을 구독한다.
      this.logger.debug('현재 채팅 룸 입장 구독 ✅ : ', roomId);
      await this.messageHandler.registerHandler(
        `${NATS_EVENTS.CHAT_ROOM}:${roomId}`,

        async (message: string) => {
          await this.subscribeService.roomSubscribeChatCallbackmessage(message);
        },
      );
    }
  }
}
