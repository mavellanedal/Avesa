import {
  Entity,
  JoinColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  OneToOne,
  Index,
} from 'typeorm';
import { BaseUuidEntity } from './base-uuid.entity';
import { PropertyOwner } from './property-owner.entity';
import { PropertyType } from './property-type.entity';
import { PropertyState } from './property-state.entity';
import { PropertyAddress } from './property-address.entity';

@Entity('property')
@Index('idx_property_owner', ['owner'])
@Index('idx_property_type', ['type'])
@Index('idx_property_state', ['currentState'])
export class Property extends BaseUuidEntity {
  @ManyToOne(() => PropertyOwner)
  @JoinColumn({ name: 'owner_id' })
  owner!: PropertyOwner;

  @ManyToOne(() => PropertyType)
  @JoinColumn({ name: 'type_id' })
  type!: PropertyType;

  @ManyToOne(() => PropertyState)
  @JoinColumn({ name: 'current_state_id' })
  currentState!: PropertyState;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'features_surface',
  })
  featuresSurface?: number;

  @Column({ type: 'int', nullable: true, name: 'features_rooms' })
  featuresRooms?: number;

  @Column({ type: 'int', nullable: true, name: 'features_bathrooms' })
  featuresBathrooms?: number;

  @Column({ type: 'boolean', default: false, name: 'features_has_elevator' })
  featuresHasElevator!: boolean;

  @Column({ type: 'boolean', default: false, name: 'features_has_pool' })
  featuresHasPool!: boolean;

  @Column({ type: 'boolean', default: false, name: 'features_has_parking' })
  featuresHasParking!: boolean;

  @Column({ type: 'boolean', default: false, name: 'features_is_furnished' })
  featuresIsFurnished!: boolean;

  @Column({ type: 'int', nullable: true, name: 'features_construction_year' })
  featuresConstructionYear?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToOne(() => PropertyAddress, (address) => address.property)
  address!: PropertyAddress;
}
