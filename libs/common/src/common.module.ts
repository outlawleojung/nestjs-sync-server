import { Module } from '@nestjs/common';
import { MailModule } from '@lib/common/utils/mail/mail.module';

@Module({
  imports: [MailModule],
  exports: [MailModule],
})
export class CommonModule {}
