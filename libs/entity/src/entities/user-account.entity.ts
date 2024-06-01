import { BaseModelEntity } from '@lib/entity/entities/base-model.entity';
import { Column, Entity, JoinTable, ManyToOne, PrimaryColumn } from 'typeorm';
import { Provider } from '@lib/entity/entities/provider.entity';

@Entity('user_account')
export class UserAccount extends BaseModelEntity {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  providerId: number;

  @Column()
  accountId: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  authData: string;

  @ManyToOne(() => Provider, (p) => p.UserAccounts, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinTable({ name: 'providerId' })
  Provider: Provider;
}
