import { Column, CreateDateColumn, Entity } from 'typeorm';
import { BaseUuidEntity } from './base-uuid.entity';

@Entity('storage_file')
export class StorageFile extends BaseUuidEntity {
  @Column({ type: 'varchar', length: 50, nullable: false })
  provider!: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  path!: string;

  @Column({ type: 'varchar', length: 100, nullable: false, name: 'mime_type' })
  mimeType!: string;

  @Column({ type: 'bigint', nullable: false, name: 'size_bytes' })
  sizeBytes!: number;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
    name: 'checksum_sha256',
  })
  checksumSha256?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'original_name',
  })
  originalName?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false, name: 'created_at' })
  createdAt!: Date;
}
