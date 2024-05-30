import { Column, Entity } from 'typeorm';
import { BaseIdModelEntity } from './base-id-model.entity';

@Entity('email_confirm')
export class EmailConfirm extends BaseIdModelEntity{

  @Column({ unique: true })
  email: string;
}