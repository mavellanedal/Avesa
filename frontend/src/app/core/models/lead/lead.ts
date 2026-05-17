import {Source} from '@models/source-tracking/source';
import {LeadStateHistory} from '@models/lead/lead-state-history';
import {BaseModel} from '@models/base-model';

export class Lead {
  public id!: string;
  public code!: string;
  public name!: string;
  public surname!: string;
  public email!: string
  public phone!: string;
  public source!: Source;
  public leadStateHistories!: LeadStateHistory[];
  public createdAt!: Date;
}
