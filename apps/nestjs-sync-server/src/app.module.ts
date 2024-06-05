import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { UnificationModule } from './unification/unification.module';

@Module({
  imports: [ChatModule, UnificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
