import { BaseTypeModelEntity } from '@lib/entity/entities/base-type-model.entity';
import { Entity, OneToMany } from 'typeorm';
import { UserAccount } from '@lib/entity/entities/user-account.entity';

@Entity('provider')
export class Provider extends BaseTypeModelEntity {
  @OneToMany(() => UserAccount, (u) => u.Provider)
  UserAccounts: UserAccount[];
}
