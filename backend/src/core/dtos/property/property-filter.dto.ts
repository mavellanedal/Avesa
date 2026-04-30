import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { FilterDto } from '@dtos/common/filter.dto';
import { Expose } from 'class-transformer';

export class PropertyFilterDto extends FilterDto {
  @IsString()
  @IsOptional()
  public typeId?: string;

  @Expose()
  public state: number;

  @IsString()
  @IsOptional()
  public city?: string;

  @IsString()
  @IsOptional()
  public ownerName?: string;

  @IsString()
  @IsOptional()
  public ownerNif?: string;

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
