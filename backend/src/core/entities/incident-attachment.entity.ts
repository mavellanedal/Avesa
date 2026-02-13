import { Column, Entity, JoinColumn, ManyToOne, Index } from 'typeorm';
import { BaseUuidEntity } from './base-uuid.entity';
import { Incident } from './incident.entity';
import { StorageFile } from './storage-file.entity';
import { AppUser } from './app-user.entity';

@Entity('incident_attachment')
@Index('idx_inc_attach_inc', ['incident'])
@Index('idx_inc_attach_file', ['storageFile'])
@Index('idx_inc_attach_user', ['uploadedByUser'])
export class IncidentAttachment extends BaseUuidEntity {
  @ManyToOne(() => Incident)
  @JoinColumn({ name: 'incident_id' })
  incident!: Incident;

  @ManyToOne(() => StorageFile)
  @JoinColumn({ name: 'storage_file_id' })
  storageFile!: StorageFile;

  @ManyToOne(() => AppUser)
  @JoinColumn({ name: 'uploaded_by_user_id' })
  uploadedByUser!: AppUser;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
    name: 'uploaded_at',
  })
  uploadedAt!: Date;
}
