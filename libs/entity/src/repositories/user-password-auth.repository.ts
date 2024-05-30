import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseRepository } from './base.repository';
import { UserPasswordAuth } from '../entities/user-password-auth.entity';

export class UserPasswordAuthRepository extends BaseRepository<UserPasswordAuth> {
  constructor(
    @InjectRepository(UserPasswordAuth)
    private userPasswordAuthRepository: Repository<UserPasswordAuth>,
  ) {
    super(userPasswordAuthRepository, UserPasswordAuth);
  }

  async create(data: UserPasswordAuth, queryRunner?: QueryRunner) {
    await this.getRepository(queryRunner).save(data);
  }
}
