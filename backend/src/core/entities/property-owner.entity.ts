import {
  Entity,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { BaseUuidEntity } from './base-uuid.entity';
import { PaymentMethod } from './payment-method.entity';

@Entity('property_owner')
@Index('idx_property_owner_payment', ['paymentMethod'])
export class PropertyOwner extends BaseUuidEntity {
  @Column({ type: 'varchar', length: 200, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  surname!: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'identification_number',
  })
  identificationNumber!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => PaymentMethod)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod!: PaymentMethod;
}
