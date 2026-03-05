import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateLeadDto {
  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty({ example: '6123456789' })
  @IsNotEmpty()
  @IsPhoneNumber('ES')
  public phone: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  public email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public source: string;
}
