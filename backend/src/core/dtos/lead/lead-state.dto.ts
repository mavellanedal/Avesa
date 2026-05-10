import { Expose, Type } from 'class-transformer';

export class LeadStateDto {
  @Expose()
  public id: number;
  @Expose()
  public name: string;
  @Expose()
  public description: string;
  @Expose({ name: 'parent' })
  @Type(() => LeadStateDto)
  public parent: LeadStateDto;
}
