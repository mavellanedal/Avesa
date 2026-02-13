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
import { FunctionalRole } from './functional-role.entity';

@Entity('login_user')
@Index('idx_login_user_app_user', ['appUserId'])
export class LoginUser extends BaseUuidEntity {
  @Column({ type: 'uuid', nullable: false, name: 'app_user_id' })
  appUserId!: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  username!: string;

  @Column({ type: 'varchar', nullable: false })
  password!: string;

  @Column({
    type: 'boolean',
    default: true,
    nullable: false,
    name: 'is_active',
  })
  isActive!: boolean;

  @OneToOne(() => AppUser)
  @JoinColumn({ name: 'app_user_id' })
  appUser!: AppUser;

  @ManyToMany(() => FunctionalRole)
  @JoinTable({
    name: 'login_role',
    joinColumn: { name: 'login_user_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'functional_role_id',
      referencedColumnName: 'id',
    },
  })
  roles!: FunctionalRole[];
}
