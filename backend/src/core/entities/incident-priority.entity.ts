import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('incident_priority')
export class IncidentPriority extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  description: string;

  @Column({ type: 'int', nullable: false, default: 24, name: 'sla_hours' })
  slaHours: number;
}
