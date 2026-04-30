import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreatePropertyResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indica si la propiedad se ha creado correctamente',
  })
  @Expose()
  public success: boolean;

  @ApiProperty({ example: 'Propiedad insertada con éxito' })
  @Expose()
  public message: string;
}
