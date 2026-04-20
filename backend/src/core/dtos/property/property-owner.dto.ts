import { PaymentMethodDto } from '@dtos/common/payment-method.dto';
import { Expose } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

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
  @IsDate()
  public createdAt: Date;
}
