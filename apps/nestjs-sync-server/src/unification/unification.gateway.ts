import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UnificationService } from './unification.service';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { RequestPayload } from '../packets/packets.interface';
import { CustomSocket } from '../interfaces/custom-socket';
import { ChatService } from '../chat/chat.service';
import { NAMESPACE, SOCKET_S_GLOBAL } from '@lib/common';

@WebSocketGateway()
@Injectable()
export class UnificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly unificationService: UnificationService,
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer()
  private server: Server;

  public getServer() {
    return this.server;
  }

  private readonly logger = new Logger(UnificationGateway.name);

  async afterInit() {
    console.log('################# setServer ####################');
    await this.setServer();
  }

  async handleConnection(client: CustomSocket, ...args: any[]) {
    this.logger.debug('Unification 소켓 연결중.✅');
    this.logger.debug(`ClientId: ${client.id} - args: ${args}`);

    await this.unificationService.handleConnection(this.server, client);
  }

  handleDisconnect(client: CustomSocket): any {
    this.logger.debug(`ClientId : ${client.id} - 소켓 연결 해제 ❌`);
  }

  @SubscribeMessage('C_REQUEST')
  async request(client: Socket, payload: RequestPayload) {
    this.logger.debug(`ClientId : ${client.id} - 요청 ✅`);
    switch (payload.type) {
      case NAMESPACE.UNIFICATION:
        await this.unificationService.handleRequestMessage(client, payload);
        break;
      case NAMESPACE.CHAT:
        await this.chatService.handleRequestMessage(client, payload);
        break;
      default:
        this.logger.debug('잘못된 type의 패킷 입니다.');
        client.emit(SOCKET_S_GLOBAL.ERROR, '잘못된 type의 패킷 입니다.');
    }
  }

  async setServer() {
    await this.unificationService.setServer(this.server);
    await this.chatService.setServer(this.server);
  }
}
