import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_MAIL_ID } from '@lib/common/constants/env-keys.const';

export type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

@Injectable()
export class MailManageService {
  private readonly logger = new Logger(MailManageService.name);
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(options: EmailOptions, context: any) {
    await this.mailerService
      .sendMail({
        to: options.to,
        from: this.configService.get<string>(ENV_MAIL_ID),
        subject: options.subject,
        template: options.html,
        context: context,
      })
      .then((success) => {
        this.logger.debug({ success });
      })
      .catch((err) => {
        this.logger.debug({ err });
      });
  }
}
