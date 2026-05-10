import {BaseModel} from '@models/base-model';

export class LeadState extends  BaseModel {
  public name?: string;
  public description?: string;
  public parent?: LeadState;
}

