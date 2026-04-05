import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'example' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '12345' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
