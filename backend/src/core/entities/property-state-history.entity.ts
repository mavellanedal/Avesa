import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { BaseUuidEntity } from './base-uuid.entity';
import { Property } from './property.entity';
import { PropertyState } from './property-state.entity';
import { AppUser } from './app-user.entity';

@Entity('property_state_history')
@Index('idx_prop_hist_prop', ['property'])
@Index('idx_prop_hist_state', ['propertyState'])
@Index('idx_prop_hist_user', ['appUser'])
export class PropertyStateHistory extends BaseUuidEntity {
  @ManyToOne(() => Property)
  @JoinColumn({ name: 'property_id' })
  property!: Property;

  @ManyToOne(() => PropertyState)
  @JoinColumn({ name: 'property_state_id' })
  propertyState!: PropertyState;

  @ManyToOne(() => AppUser)
  @JoinColumn({ name: 'app_user_id' })
  appUser!: AppUser;

  @CreateDateColumn({ type: 'timestamp', nullable: false, name: 'change_date' })
  changeDate!: Date;
}
