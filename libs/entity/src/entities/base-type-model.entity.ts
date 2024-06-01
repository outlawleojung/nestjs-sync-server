import { Column, PrimaryColumn } from 'typeorm';

export class BaseTypeModelEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;
}
