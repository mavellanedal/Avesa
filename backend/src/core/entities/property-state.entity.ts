import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('property_state')
export class PropertyState extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  description: string;
}
