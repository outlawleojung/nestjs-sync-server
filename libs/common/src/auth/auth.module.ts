import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  EmailConfirm,
  EmailConfirmRepository,
  EmailVerification,
  EmailVerificationRepository,
  UserAccount,
  UserAccountRepository,
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
      UserAccount,
      UserPasswordAuth,
    ]),
  ],
  providers: [
    AuthService,
    JwtService,
    UserRepository,
    UserAccountRepository,
    EmailConfirmRepository,
    EmailVerificationRepository,
  ],
  exports: [
    AuthService,
    JwtService,
    UserRepository,
    UserAccountRepository,
    EmailConfirmRepository,
    EmailVerificationRepository,
  ],
})
export class AuthModule {}
