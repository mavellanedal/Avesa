import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('source')
export class Source extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  description!: string;
}
