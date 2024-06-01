import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entities/user-model.entity';
import { EmailConfirm } from './entities/email-confirm.entity';
import { EmailVerification } from './entities/email-verification.entity';
import { UserPasswordAuth } from './entities/user-password-auth.entity';
import {
  ENV_DB_DATABASE,
  ENV_DB_HOST,
  ENV_DB_PASSWORD,
  ENV_DB_USERNAME,
} from '@lib/common/constants/env-keys.const';
import { UserAccount } from '@lib/entity/entities/user-account.entity';
import { Provider } from '@lib/entity/entities/provider.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env[ENV_DB_HOST],
      username: process.env[ENV_DB_USERNAME],
      password: process.env[ENV_DB_PASSWORD],
      database: process.env[ENV_DB_DATABASE],
      entities: [
        EmailConfirm,
        EmailVerification,
        Provider,
        UserAccount,
        UserModel,
        UserPasswordAuth,
      ],
      synchronize: true,
      logging: true,
    }),
  ],
  providers: [],
  exports: [],
})
export class EntityModule {}
