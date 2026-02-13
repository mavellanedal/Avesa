import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('lead_state')
@Index('idx_lead_state_parent', ['parent'])
export class LeadState extends BaseEntity {
  @Column({ type: 'int', nullable: true, name: 'parent_id' })
  parentId!: number | null;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  description!: string;

  @ManyToOne(() => LeadState)
  @JoinColumn({ name: 'parent_id' })
  parent?: LeadState;

  @OneToMany(() => LeadState, (state) => state.parent)
  children!: LeadState[];
}
