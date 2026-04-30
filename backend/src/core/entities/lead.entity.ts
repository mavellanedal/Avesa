import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  Index,
  OneToMany
} from 'typeorm';
import { BaseUuidEntity } from './base-uuid.entity';
import { Source } from './source.entity';
import { AppUser } from './app-user.entity';
import { LeadStateHistory } from './lead-state-history.entity';

@Entity('lead')
@Index('idx_lead_source', ['source'])
@Index('idx_lead_user', ['currentAssignedAppUser'])
export class Lead extends BaseUuidEntity {
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  code: string;

  @ManyToOne(() => Source)
  @JoinColumn({ name: 'source_id' })
  source: Source;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  surname?: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  phone: string;

  @ManyToOne(() => AppUser)
  @JoinColumn({ name: 'current_assigned_app_user_id' })
  currentAssignedAppUser: AppUser;

  @Column({
    type: 'int',
    default: 0,
    nullable: true,
    name: 'ai_score',
  })
  aiScore?: number;

  @Column({ type: 'text', nullable: true })
  aiSummary?: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
    name: 'budget_min',
  })
  budgetMin?: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
    name: 'budget_max',
  })
  budgetMax?: number;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    name: 'preferred_zone',
  })
  preferredZone?: string;

  @Column({
    type: 'date',
    nullable: true,
    name: 'move_in_date',
  })
  moveInDate?: Date;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
    name: 'needs_pet_friendly',
  })
  needsPetFriendly: boolean;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
    name: 'needs_elevator',
  })
  needsElevator: boolean;

  @CreateDateColumn({ type: 'timestamp', nullable: false, name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => LeadStateHistory, (history) => history.lead)
  leadStateHistories: LeadStateHistory[];
}
