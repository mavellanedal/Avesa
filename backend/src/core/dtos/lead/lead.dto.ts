import { Expose, Type } from 'class-transformer';
import { IsDate, IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { SourceDto } from '../source/source.dto';
import { LeadStateHistoryDto } from './lead-state-history.dto';

export class LeadDto {
  @Expose()
  @IsString()
  public leadCode: string;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public surname: string;

  @Expose()
  @IsEmail()
  public email: string;

  @Expose()
  @IsPhoneNumber('ES')
  public phone: string;

  @Expose()
  @Type(() => SourceDto)
  public source: SourceDto;

  @Expose()
  @Type(() => LeadStateHistoryDto)
  public leadStateHistory: LeadStateHistoryDto[];

  @Expose()
  @IsDate()
  public date: Date;
}
