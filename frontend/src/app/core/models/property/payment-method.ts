import {BaseModel} from '@models/base-model';

export class PaymentMethod extends BaseModel {
  public name!: string;
  public description!: string;
}
