import { Expose } from 'class-transformer';
import { PropertyDto } from './property.dto';
import { IsNumber, IsString } from 'class-validator';

export class PropertyAddressDto {
  id: string;

  @Expose()
  public property: PropertyDto;

  @Expose()
  @IsString()
  public street: string;

  @Expose()
  @IsString()
  public number: string;

  @Expose()
  @IsString()
  public floor: string;

  @Expose()
  @IsString()
  public door: string;

  @Expose()
  @IsString()
  public postalCode: string;

  @Expose()
  @IsString()
  public city: string;

  @Expose()
  @IsString()
  public province: string;

  @Expose()
  @IsString()
  public country: string;

  @Expose()
  @IsNumber()
  public latitude: number;

  @Expose()
  @IsNumber()
  public longitude: number;
}
