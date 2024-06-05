import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UnificationService } from './unification.service';
import { UnificationGateway } from './unification.gateway';
import { ChatModule } from '../chat/chat.module';
import { SubscribeService } from '../services/subscribe.service';
import { NatsMessageHandler, NatsService } from '@lib/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ChatModule,
  ],
  providers: [
    UnificationGateway,
    UnificationService,
    SubscribeService,
    NatsMessageHandler,
    NatsService,
  ],
})
export class UnificationModule {}
