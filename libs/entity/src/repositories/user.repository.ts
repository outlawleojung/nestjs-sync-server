import { BaseRepository } from './base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { UserModel } from '../entities/user-model.entity';

export class UserRepository extends BaseRepository<UserModel> {
  constructor(
    @InjectRepository(UserModel) private userRepository: Repository<UserModel>,
  ) {
    super(userRepository, UserModel);
  }

  /**
   * 사용자 아이디로 사용자 조회
   * @param userId
   */
  async findByUserId(userId: string): Promise<UserModel | null> {
    if (!userId) return null;

    return await this.repository.findOneBy({ id: userId });
  }

  /**
   * 이메일로 사용자 조회
   * @param email
   */
  async findByEmail(email: string): Promise<UserModel | null> {
    if (!email) return null;

    return await this.repository.findOneBy({ email });
  }

  /**
   * 이름으로 사용자 조회
   * @param email
   */
  async findByName(name: string): Promise<UserModel | null> {
    if (!name) return null;

    return await this.repository.findOneBy({ name });
  }

  async createUser(data: Partial<UserModel>, queryRunner?: QueryRunner) {
    await this.getRepository(queryRunner).save(data);
  }

  async updateUser(
    data: Partial<UserModel>,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const { id, ...updateData } = data;

    const user = await this.getRepository(queryRunner).findOneBy({ id });

    if (!user) {
      throw new Error('Not Found User');
    }

    Object.assign(user, updateData);

    await this.getRepository(queryRunner).save(user);
  }
}
