import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreatePropertyResponseDto {
  @ApiProperty({ example: 'Lfyn1o2Q35' })
  @Expose({ name: 'code' })
  public propertyCode: string;
}
