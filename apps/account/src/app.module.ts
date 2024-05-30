import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AccountController } from './account/account.controller';
import { AccountModule } from './account/account.module';
import { AuthModule } from '@lib/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),

    AccountModule,
    AuthModule,
  ],
  controllers: [AppController, AccountController],
  providers: [AppService],
})
export class AppModule {}
