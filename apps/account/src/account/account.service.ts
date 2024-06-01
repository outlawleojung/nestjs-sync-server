import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  EmailConfirmRepository,
  EmailVerificationRepository,
  UserAccountRepository,
} from '@lib/entity';
import {
  EmailOptions,
  ENV_MAIL_REMAIN_SECOND,
  MailManageService,
} from '@lib/common';

@Injectable()
export class AccountService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailService: MailManageService,
    private readonly userAccountRepository: UserAccountRepository,
    private readonly emailConfirmRepository: EmailConfirmRepository,
    private readonly emailVaificationRepository: EmailVerificationRepository,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async authenticateEmail(email: string, queryRunner: QueryRunner) {
    const exUserAccount = await this.userAccountRepository.findByEmail(email);

    if (exUserAccount) {
      throw new Error('이미 가입 된 이메일 입니다.');
    }

    const remainSecond =
      Number(this.configService.get<number>(ENV_MAIL_REMAIN_SECOND) || 180) *
      1000;
    const authCode: number = Math.floor(Math.random() * 8999) + 1000;

    const emailOptions: EmailOptions = {
      to: email,
      subject: '회원가입 이메일 인증',
      html: 'emailAuth',
      text: '이메일 인증 메일 입니다.',
    };

    const context = {
      authCode,
      remainSecond,
    };

    await this.mailService.sendEmail(emailOptions, context);

    // 기존에 정보가 남아 있다면 삭제한다.
    await this.emailVaificationRepository.deleteByExists(email, queryRunner);

    await this.emailVaificationRepository.create(email, authCode, queryRunner);

    setTimeout(async () => {
      await this.emailVaificationRepository.deleteByExists(email);
    }, remainSecond);

    // 기존 이메일 인증 확인 정보는 삭제
    await this.emailConfirmRepository.deleteByExists(email);

    return {
      remainSecond,
    };
  }
}
