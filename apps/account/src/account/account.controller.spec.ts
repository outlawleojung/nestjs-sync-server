import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { ConfigService } from '@nestjs/config';
import { AuthService, MailManageService } from '@lib/common';
import {
  UserAccountRepository,
  EmailConfirmRepository,
  EmailVerificationRepository,
  UserRepository,
} from '@lib/entity';
import { JwtService } from '@nestjs/jwt';

describe('AccountController', () => {
  let accountController: AccountController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        AccountService,
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: MailManageService,
          useValue: {
            sendEmail: jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: UserAccountRepository,
          useValue: {
            findByEmail: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: EmailConfirmRepository,
          useValue: {
            deleteByExists: jest.fn(),
          },
        },
        {
          provide: EmailVerificationRepository,
          useValue: {
            deleteByExists: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    accountController = app.get<AccountController>(AccountController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(accountController.getHello()).toBe('Hello World!');
    });
  });
});
