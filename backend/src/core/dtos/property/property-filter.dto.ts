import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class PropertyFilterDto {
  @IsString()
  @IsOptional()
  public typeId?: string;

  @IsString()
  @IsOptional()
  public city?: string;

  @IsString()
  @IsOptional()
  public ownerName?: string;

  @IsString()
  @IsOptional()
  public ownerNif?: string;

  @IsString()
  @IsOptional()
  public ownerPhone?: string;

  @IsString()
  @IsOptional()
  public ownerEmail?: string;

  @IsNumber()
  @IsOptional()
  public surface?: number;

  @IsNumber()
  @IsOptional()
  public rooms?: number;

  @IsNumber()
  @IsOptional()
  public bathrooms?: number;

  @IsBoolean()
  @IsOptional()
  public hasElevator?: boolean;

  @IsBoolean()
  @IsOptional()
  public hasParking?: boolean;

  @IsBoolean()
  @IsOptional()
  public hasPool?: boolean;

  @IsBoolean()
  @IsOptional()
  public isFurnished?: boolean;

  @IsNumber()
  @IsOptional()
  public constructionYear?: number;
}
