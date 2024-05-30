import { Column, Entity, Index } from 'typeorm';
import { BaseIdModelEntity } from './base-id-model.entity';

@Index('email', ['email'], { unique: true })
@Entity('email_verification')
export class EmailVerification extends BaseIdModelEntity {

  @Column({ unique: true })
  email: string;

  @Column()
  authCode: number;
}
