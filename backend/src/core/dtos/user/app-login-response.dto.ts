import { UserAttributesDto } from './user-attributes.dto';

export class AppLoginResponseDto {
  public accessToken: string;
  public user: UserAttributesDto;
}
