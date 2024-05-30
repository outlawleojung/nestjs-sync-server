import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseModelEntity {

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}