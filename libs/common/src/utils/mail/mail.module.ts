import { join } from 'path';
import { ENV_MAIL_HOST, ENV_MAIL_ID, ENV_MAIL_PASSWORD } from '@lib/common';
import { MailManageService } from './mail.service';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: `smtps://${process.env[ENV_MAIL_ID]}:${process.env[ENV_MAIL_PASSWORD]}@${process.env[ENV_MAIL_HOST]}`,
      defaults: {
        from: `"admin" <${process.env.MAIL_ID}>`,
      },
      template: {
        dir: join(__dirname, '..', 'account/views'),
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailManageService],
  exports: [MailManageService],
})
export class MailModule {}
