import {Source} from '@models/source-tracking/source';
import {LeadStateHistory} from '@models/lead/lead-state-history';
import {BaseModel} from '@models/base-model';

export class Lead extends BaseModel {
  public leadCode!: string;
  public name!: string;
  public surname!: string;
  public email!: string
  public phone!: string;
  public source!: Source;
  public leadStateHistory!: LeadStateHistory[];
  public date!: Date;
}
