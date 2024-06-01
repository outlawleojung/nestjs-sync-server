import { BaseRepository } from '@lib/entity/repositories/base.repository';
import { UserAccount } from '@lib/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

export class UserAccountRepository extends BaseRepository<UserAccount> {
  constructor(
    @InjectRepository(UserAccount)
    private userAccountRepository: Repository<UserAccount>,
  ) {
    super(userAccountRepository, UserAccount);
  }

  async findByUserId(
    userId: string,
    queryRunner?: QueryRunner,
  ): Promise<UserAccount[] | null> {
    return await this.getRepository(queryRunner).findBy({ userId });
  }

  async findByUserIdAndProvider(
    userId: string,
    providerId: number,
    queryRunner?: QueryRunner,
  ): Promise<UserAccount | null> {
    return await this.getRepository(queryRunner).findOneBy({
      userId,
      providerId,
    });
  }

  async findByEmail(
    email: string,
    queryRunner?: QueryRunner,
  ): Promise<UserAccount | null> {
    return await this.getRepository(queryRunner).findOneBy({ email });
  }
}
