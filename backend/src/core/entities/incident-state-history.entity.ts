import { Entity, JoinColumn, ManyToOne, Column, Index } from 'typeorm';
import { BaseUuidEntity } from './base-uuid.entity';
import { Incident } from './incident.entity';
import { IncidentState } from './incident-state.entity';
import { IncidentAction } from './incident-action.entity';
import { AppUser } from './app-user.entity';

@Entity('incident_state_history')
@Index('idx_inc_hist_inc', ['incident'])
@Index('idx_inc_hist_state', ['incidentState'])
@Index('idx_inc_hist_action', ['action'])
@Index('idx_inc_hist_user', ['appUser'])
@Index('idx_inc_hist_assigned', ['assignedToAppUser'])
export class IncidentStateHistory extends BaseUuidEntity {
  @ManyToOne(() => Incident)
  @JoinColumn({ name: 'incident_id' })
  incident: Incident;

  @ManyToOne(() => IncidentState)
  @JoinColumn({ name: 'incident_state_id' })
  incidentState: IncidentState;

  @ManyToOne(() => IncidentAction)
  @JoinColumn({ name: 'action_id' })
  action: IncidentAction;

  @ManyToOne(() => AppUser)
  @JoinColumn({ name: 'app_user_id' })
  appUser: AppUser;

  @ManyToOne(() => AppUser)
  @JoinColumn({ name: 'assigned_to_app_user_id' })
  assignedToAppUser: AppUser;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'action_date',
  })
  actionDate: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'previous_value',
  })
  previousValue?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'new_value' })
  newValue?: string;
}
