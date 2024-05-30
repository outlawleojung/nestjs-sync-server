import { DeleteResult, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base.repository';
import { EmailVerification } from '../entities/email-verification.entity';

export class EmailVerificationRepository extends BaseRepository<EmailVerification> {
  constructor(
    @InjectRepository(EmailVerification)
    private emailVerificationRepository: Repository<EmailVerification>,
  ) {
    super(emailVerificationRepository, EmailVerification);
  }

  async findByEmailAndAuthCode(
    email: string,
    authCode: number,
  ): Promise<EmailVerification | null> {
    return await this.repository.findOne({
      where: {
        email,
        authCode,
      },
    });
  }

  async deleteById(
    id: number,
    queryRunner?: QueryRunner,
  ): Promise<DeleteResult> {
    return await this.getRepository(queryRunner).delete({ id });
  }

  async deleteByExists(email: string, queryRunner?: QueryRunner) {
    await this.repository.findOne({ where: { email } }).then(async (data) => {
      if (data) {
        (await this.getRepository(queryRunner)).delete({ id: data.id });
      }
    });
  }

  async create(email: string, authCode: number, queryRunner: QueryRunner) {
    await this
      .getRepository(queryRunner)
      .save({ email, authCode });
  }
}
