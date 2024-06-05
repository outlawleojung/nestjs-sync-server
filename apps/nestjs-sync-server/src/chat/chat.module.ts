import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { NatsMessageHandler, NatsService } from '@lib/common';
import { SubscribeService } from '../services/subscribe.service';

@Module({
  providers: [ChatService, SubscribeService, NatsService, NatsMessageHandler],
  exports: [ChatService],
})
export class ChatModule {}
