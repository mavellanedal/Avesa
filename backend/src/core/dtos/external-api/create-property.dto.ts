import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreatePropertyOwnerExternalDto {
  @ApiProperty({ example: 'Ana' })
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty({ example: 'García' })
  @IsString()
  @IsNotEmpty()
  public surname: string;

  @ApiProperty({ example: '12345678Z' })
  @IsString()
  @IsNotEmpty()
  public identificationNumber: string;

  @ApiPropertyOptional({ example: '600123456' })
  @IsString()
  @IsOptional()
  public phone?: string;

  @ApiPropertyOptional({ example: 'ana@gmail.com' })
  @IsString()
  @IsOptional()
  public email?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  public paymentMethodId: number;
}

export class CreatePropertyDto {
  @ApiProperty({ type: CreatePropertyOwnerExternalDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CreatePropertyOwnerExternalDto)
  @IsNotEmpty()
  public owner: CreatePropertyOwnerExternalDto;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  public typeId: number;

  @ApiProperty({ example: 120 })
  @IsNumber()
  @IsNotEmpty()
  public featuresSurface: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsNotEmpty()
  public featuresRooms: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  public featuresBathrooms: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  public featuresHasElevator: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsNotEmpty()
  public featuresHasParking: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  public featureIsFurnished: boolean;

  @ApiProperty({ example: 2005 })
  @IsNumber()
  @IsNotEmpty()
  public featureConstructionYear: number;
}
