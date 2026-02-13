import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  Column,
  Index,
  Generated,
} from 'typeorm';
import { BaseUuidEntity } from './base-uuid.entity';
import { Property } from './property.entity';
import { IncidentPriority } from './incident-priority.entity';
import { IncidentCategory } from './incident-category.entity';
import { IncidentState } from './incident-state.entity';
import { AppUser } from './app-user.entity';

@Entity('incident')
@Index('idx_incident_prop', ['property'])
@Index('idx_incident_prio', ['priority'])
@Index('idx_incident_cat', ['category'])
@Index('idx_incident_state', ['currentState'])
@Index('idx_incident_user', ['currentAssignedAppUser'])
export class Incident extends BaseUuidEntity {
  @Generated('increment')
  @Column({ type: 'bigint', unique: true })
  code!: number;

  @ManyToOne(() => Property)
  @JoinColumn({ name: 'property_id' })
  property!: Property;

  @ManyToOne(() => IncidentPriority)
  @JoinColumn({ name: 'priority_id' })
  priority!: IncidentPriority;

  @ManyToOne(() => IncidentCategory)
  @JoinColumn({ name: 'category_id' })
  category!: IncidentCategory;

  @ManyToOne(() => IncidentState)
  @JoinColumn({ name: 'current_state_id' })
  currentState!: IncidentState;

  @ManyToOne(() => AppUser)
  @JoinColumn({ name: 'current_assigned_app_user_id' })
  currentAssignedAppUser?: AppUser;

  @Column({ type: 'timestamp', nullable: false, name: 'reported_at' })
  reportedAt!: Date;

  @CreateDateColumn({ type: 'timestamp', nullable: false, name: 'created_at' })
  createdAt!: Date;
}
