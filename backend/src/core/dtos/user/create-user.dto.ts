import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsInt,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public surname: string;

  @IsString()
  @IsNotEmpty()
  public identificationNumber: string;

  @IsEmail()
  public email: string;

  @IsOptional()
  @IsString()
  public phone?: string;

  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsString()
  @MinLength(8)
  public password: string;

  @IsOptional()
  @IsBoolean()
  public isActive?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  public functionalRoleIds?: number[];
}
