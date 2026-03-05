import {
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { BaseUuidEntity } from './base-uuid.entity';
import { Lead } from './lead.entity';
import { LeadState } from './lead-state.entity';
import { AppUser } from './app-user.entity';

@Entity('lead_state_history')
@Index('idx_lead_hist_lead', ['lead'])
@Index('idx_lead_hist_state', ['leadState'])
@Index('idx_lead_hist_user', ['appUser'])
export class LeadStateHistory extends BaseUuidEntity {
  @ManyToOne(() => Lead)
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  @ManyToOne(() => LeadState)
  @JoinColumn({ name: 'lead_state_id' })
  leadState: LeadState;

  @ManyToOne(() => AppUser)
  @JoinColumn({ name: 'app_user_id' })
  appUser: AppUser;

  @CreateDateColumn({ type: 'timestamp', name: 'change_date' })
  changeDate: Date;
}
