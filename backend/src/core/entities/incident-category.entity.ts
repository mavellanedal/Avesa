import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('incident_category')
@Index('idx_incident_category_parent', ['parent'])
export class IncidentCategory extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  description!: string;

  @ManyToOne(() => IncidentCategory, (cat) => cat.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent!: IncidentCategory | null;

  @OneToMany(() => IncidentCategory, (cat) => cat.parent)
  children!: IncidentCategory[];
}
