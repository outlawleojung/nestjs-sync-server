import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entities/user-model.entity';
import { EmailConfirm } from './entities/email-confirm.entity';
import { EmailVerification } from './entities/email-verification.entity';
import { UserPasswordAuth } from './entities/user-password-auth.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [UserModel, EmailConfirm, EmailVerification, UserPasswordAuth],
      synchronize: true,
      logging: true,
    }),
  ],
  providers: [],
  exports: [],
})
export class EntityModule {}
