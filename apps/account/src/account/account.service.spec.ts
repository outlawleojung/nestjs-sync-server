import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { QueryRunner } from 'typeorm';
import { AccountService } from './account.service';
import {
  UserAccountRepository,
  EmailConfirmRepository,
  EmailVerificationRepository,
  UserAccount,
} from '@lib/entity';
import { MailManageService } from '@lib/common';

describe('AccountService', () => {
  let service: AccountService;
  let configService: ConfigService;
  let mailService: MailManageService;
  let userAccountRepository: UserAccountRepository;
  let emailConfirmRepository: EmailConfirmRepository;
  let emailVerificationRepository: EmailVerificationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(180),
          },
        },
        {
          provide: MailManageService,
          useValue: {
            sendEmail: jest.fn(),
          },
        },
        {
          provide: UserAccountRepository,
          useValue: {
            findByEmail: jest.fn(),
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
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    configService = module.get<ConfigService>(ConfigService);
    mailService = module.get<MailManageService>(MailManageService);
    userAccountRepository = module.get<UserAccountRepository>(
      UserAccountRepository,
    );
    emailConfirmRepository = module.get<EmailConfirmRepository>(
      EmailConfirmRepository,
    );
    emailVerificationRepository = module.get<EmailVerificationRepository>(
      EmailVerificationRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('authenticateEmail', () => {
    it('should throw an error if the email already exists', async () => {
      const mockUserAccount: UserAccount = {
        userId: 'mockUserId',
        providerId: 1,
        accountId: 'test@example.com',
        email: 'test@example.com',
        password: 'hashedPassword',
        authData: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        Provider: null,
      };

      jest
        .spyOn(userAccountRepository, 'findByEmail')
        .mockResolvedValueOnce(mockUserAccount);

      await expect(
        service.authenticateEmail('test@example.com', {} as QueryRunner),
      ).rejects.toThrow('이미 가입 된 이메일 입니다.');
    });

    it('should send an email if the email does not exist', async () => {
      jest
        .spyOn(userAccountRepository, 'findByEmail')
        .mockResolvedValueOnce(null);
      jest
        .spyOn(emailVerificationRepository, 'create')
        .mockResolvedValueOnce(undefined);
      jest
        .spyOn(emailVerificationRepository, 'deleteByExists')
        .mockResolvedValueOnce(undefined);
      jest
        .spyOn(emailConfirmRepository, 'deleteByExists')
        .mockResolvedValueOnce(undefined);
      jest.spyOn(mailService, 'sendEmail').mockResolvedValueOnce(undefined);

      const result = await service.authenticateEmail(
        'test@example.com',
        {} as QueryRunner,
      );

      expect(mailService.sendEmail).toHaveBeenCalled();
      expect(emailVerificationRepository.deleteByExists).toHaveBeenCalledWith(
        'test@example.com',
        {},
      );
      expect(emailVerificationRepository.create).toHaveBeenCalled();
      expect(emailConfirmRepository.deleteByExists).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(result).toHaveProperty('remainSecond');
    });
  });
});
