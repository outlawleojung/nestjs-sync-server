import { BaseModelEntity } from './base-model.entity';
import { Column, Entity, Index, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserPasswordAuth } from './user-password-auth.entity';

@Index('name', ['name'])
@Entity('user')
export class UserModel extends BaseModelEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({unique: true})
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  refreshToken: string;

  @OneToOne(

    () => UserPasswordAuth,
    (userPasswordAuth) => userPasswordAuth.User,
  )
  UserPasswordAuth: UserPasswordAuth;
}