import {
  Entity,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { BaseUuidEntity } from './base-uuid.entity';
import { BlackListType } from './black-list-type.entity';

@Entity('black_list')
@Index('idx_black_list_type', ['type'])
export class BlackList extends BaseUuidEntity {
  @ManyToOne(() => BlackListType)
  @JoinColumn({ name: 'type_id' })
  type!: BlackListType;

  @Column({ type: 'varchar', length: 255, nullable: false })
  value!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reason!: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;
}
