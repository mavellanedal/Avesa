import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FunctionalRole } from './functional-role.entity';

@Entity('groups')
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false, type: 'varchar', length: 50 })
  name: string;

  @Column({ nullable: false, type: 'varchar', length: 100 })
  description: string;

  @ManyToMany(() => FunctionalRole)
  @JoinTable({
    name: 'groups_functional_role',
    joinColumn: { name: 'group_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'functional_role_id',
      referencedColumnName: 'id',
    },
  })
  functionalRoles: FunctionalRole[];
}
