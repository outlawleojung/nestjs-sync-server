import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AuthModule } from '@lib/common';
import { EntityModule } from '@lib/entity';

@Module({
  imports: [AuthModule, EntityModule],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
