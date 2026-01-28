import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Index,
} from 'typeorm';
import { BaseUuidEntity } from './base-uuid.entity';
import { Incident } from './incident.entity';
import { Availability } from './availability.entity';

@Entity('incident_owner')
@Index('idx_inc_owner_avail', ['availability'])
export class IncidentOwner extends BaseUuidEntity {
  @OneToOne(() => Incident)
  @JoinColumn({ name: 'incident_id' })
  incident: Incident;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @ManyToOne(() => Availability)
  @JoinColumn({ name: 'availability_id' })
  availability: Availability;
}
