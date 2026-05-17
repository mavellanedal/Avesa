import {BaseModel} from '@models/base-model';
import {PaymentMethod} from '@models/property/payment-method';

export class PropertyOwner extends BaseModel {
  public name!: string;
  public surname!: string;
  public identificationNumber!: string
  public phone!: string;
  public email!: string;
  public paymentMethod!: PaymentMethod;
  public createdAt!: Date;
}
