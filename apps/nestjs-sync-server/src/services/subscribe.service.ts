import { Injectable, Logger } from '@nestjs/common';
import { ChatService } from '../chat/chat.service';
import { CHAT_SOCKET_C_MESSAGE, CHAT_SOCKET_S_MESSAGE } from '@lib/common';

@Injectable()
export class SubscribeService {
  private readonly logger = new Logger(SubscribeService.name);

  constructor(private readonly chatService: ChatService) {}

  async roomSubscribeChatCallbackmessage(message) {
    this.logger.debug('채팅 룸 구독 콜백 ✅');
    const data = JSON.parse(message);
    console.log(data);

    switch (data.packet.eventName) {
      case CHAT_SOCKET_S_MESSAGE.S_SEND_MESSAGE:
      case CHAT_SOCKET_S_MESSAGE.S_ENTER:
        await this.chatService.broadcastMessage(data);
        break;
      case CHAT_SOCKET_C_MESSAGE.C_SEND_DIRECT_MESSAGE:
        break;
      case CHAT_SOCKET_C_MESSAGE.C_SEND_FRIEND_DIRECT_MESSAGE:
        break;
      default:
        this.logger.debug('잘못된 채팅 패킷 입니다.');
        break;
    }
  }
}
