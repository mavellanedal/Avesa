import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { BaseUuidEntity } from './base-uuid.entity';
import { Incident } from './incident.entity';
import { AppUser } from './app-user.entity';

@Entity('incident_comment')
@Index('idx_inc_comment_inc', ['incident'])
@Index('idx_inc_comment_user', ['appUser'])
export class IncidentComment extends BaseUuidEntity {
  @ManyToOne(() => Incident)
  @JoinColumn({ name: 'incident_id' })
  incident!: Incident;

  @ManyToOne(() => AppUser)
  @JoinColumn({ name: 'app_user_id' })
  appUser!: AppUser;

  @Column({ type: 'text', nullable: false })
  text!: string;

  @Column({
    type: 'boolean',
    default: true,
    nullable: false,
    name: 'is_internal',
  })
  isInternal!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;
}
