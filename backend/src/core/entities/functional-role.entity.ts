import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('functional_role')
export class FunctionalRole extends BaseEntity {
  @Column({ unique: true, nullable: false, type: 'varchar', length: 50 })
  name: string;

  @Column({ nullable: false, type: 'varchar', length: 100 })
  description: string;
}
