import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { BaseModelEntity } from './base-model.entity';
import { UserModel } from './user-model.entity';

@Index('token', ['token'], {})
@Entity('user_password_auth')
export class UserPasswordAuth extends BaseModelEntity{
  @PrimaryColumn('uuid')
  userId: string;

  @Column()
  token: string;

  @Column()
  ttl: number;

  @OneToOne(() => UserModel, (user) => user.UserPasswordAuth, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  User: UserModel;
}
