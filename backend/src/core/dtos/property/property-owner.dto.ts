import { PaymentMethodDto } from '@dtos/common/payment-method.dto';
import { Expose, Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { Util } from '@shared/utilities/util';

export class PropertyOwnerDto {
  public id: string;
  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public surname: string;

  @Expose()
  @IsString()
  public identificationNumber: string;

  @Expose()
  @IsString()
  public phone: string;

  @Expose()
  @IsString()
  public email: string;

  @Expose()
  public paymentMethod: PaymentMethodDto;

  @Expose()
  @Transform(({ value }) => Util.parseDateValue(value))
  public createdAt: Date;
}
