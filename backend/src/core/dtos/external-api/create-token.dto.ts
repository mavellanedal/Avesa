import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTokenDto {
  @ApiProperty({ description: 'Username of the user', example: 'test' })
  @IsString()
  @IsNotEmpty()
  public username: string;
  @ApiProperty({ description: 'Password of the user', example: 'password' })
  @IsString()
  @IsNotEmpty()
  public password: string;
}
