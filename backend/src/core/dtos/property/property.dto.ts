import { Expose } from 'class-transformer';
import { PropertyOwnerDto } from './property-owner.dto';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { PropertyTypeDto } from './property-type.dto';

export class PropertyDto {
  id: string;

  @Expose()
  public owner: PropertyOwnerDto;

  @Expose()
  @IsString()
  public address: string;

  @Expose()
  public type: PropertyTypeDto;

  @Expose()
  @IsNumber()
  public featuresSurface: number;

  @Expose()
  @IsNumber()
  public featuresRooms: number;

  @Expose()
  @IsNumber()
  public featuresBathrooms: number;

  @Expose()
  @IsBoolean()
  public featuresHasElevator: boolean;

  @Expose()
  @IsBoolean()
  public featuresHasParking: boolean;

  @Expose()
  @IsBoolean()
  public featureIsFurnished: boolean;

  @Expose()
  @IsNumber()
  public featureConstructionYear: number;

  @Expose()
  @IsDate()
  public createdAt: Date;
}
