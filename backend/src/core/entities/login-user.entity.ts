import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
  Index,
} from 'typeorm';
import { BaseUuidEntity } from './base-uuid.entity';
import { AppUser } from './app-user.entity';
import { Source } from './source.entity';
import { Group } from './group.entity';

@Entity('login_user')
@Index('idx_login_user_app_user', ['appUserId'])
export class LoginUser extends BaseUuidEntity {
  @Column({ type: 'uuid', nullable: false, name: 'app_user_id' })
  appUserId: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  username: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({
    type: 'boolean',
    default: true,
    nullable: false,
    name: 'is_active',
  })
  isActive: boolean;

  @OneToOne(() => AppUser)
  @JoinColumn({ name: 'app_user_id' })
  appUser: AppUser;

  @OneToOne(() => Source)
  @JoinColumn({ name: 'source_id' })
  source: Source;

  @ManyToMany(() => Group)
  @JoinTable({
    name: 'login_group',
    joinColumn: { name: 'login_user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'group_id', referencedColumnName: 'id' },
  })
  groups: Group[];
}
