import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  EmailConfirm,
  EmailVerification,
  UserModel,
  UserPasswordAuth,
  UserRepository,
} from '@lib/entity';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserModel,
      EmailConfirm,
      EmailVerification,
      UserPasswordAuth,
    ]),
  ],
  providers: [AuthService, JwtService, UserRepository],
  exports: [AuthService, JwtService, UserRepository],
})
export class AuthModule {}
