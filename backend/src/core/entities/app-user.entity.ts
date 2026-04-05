import { Entity, Column, CreateDateColumn } from 'typeorm';
import { BaseUuidEntity } from './base-uuid.entity';

@Entity('app_user')
export class AppUser extends BaseUuidEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  surname: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    name: 'identification_number',
  })
  identificationNumber: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  constructor(id?: string) {
    super();
    if (id !== undefined) {
      this.id = id;
    }
  }
}
