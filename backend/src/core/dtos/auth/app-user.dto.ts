import { Expose } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class AppUserDto {
  @Expose()
  public id: string;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public surname: string;

  @Expose()
  @IsString()
  public identificationNumber: string;

  @Expose()
  @IsString()
  public phone: string;

  @Expose()
  @IsString()
  public email: string;

  @Expose()
  @IsDate()
  public createdAt: Date;
}
