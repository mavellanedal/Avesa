import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenResponseDto {
  @ApiProperty({ example: 'aB-CD1234EF5678GHI90JKL' })
  token: string;
}
