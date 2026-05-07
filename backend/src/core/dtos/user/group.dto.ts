import { Expose } from 'class-transformer';

export class GroupDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  level: number;
}
