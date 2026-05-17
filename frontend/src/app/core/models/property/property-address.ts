import {BaseModel} from '@models/base-model';

export class PropertyAddress extends BaseModel {
  public street!: string;
  public number!: string;
  public floor!: string;
  public door!: string;
  public postalCode!: string;
  public city!: string;
  public province!: string;
  public country!: string;
  public latitude!: string;
  public longitude!: string;

}
