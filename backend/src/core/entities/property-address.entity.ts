import { Entity, OneToOne, JoinColumn, Column } from 'typeorm';
import { BaseUuidEntity } from './base-uuid.entity';
import { Property } from './property.entity';

@Entity('property_address')
export class PropertyAddress extends BaseUuidEntity {
  @OneToOne(() => Property)
  @JoinColumn({ name: 'property_id' })
  property!: Property;

  @Column({ type: 'varchar', length: 200, nullable: false })
  street!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  number!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  floor?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  door?: string;

  @Column({ type: 'varchar', length: 10, nullable: false, name: 'postal_code' })
  postalCode!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  city!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  province?: string;

  @Column({ type: 'varchar', length: 100, default: 'España' })
  country!: string;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  longitude?: number;
}
