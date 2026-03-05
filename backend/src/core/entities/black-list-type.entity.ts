import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('black_list_type')
export class BlackListType extends BaseEntity {
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  description: string;
}
