import {BaseFilter} from '@models/base-filter';

export class LeadFilter extends BaseFilter {
  public leadCode?: string;
  public phone?: string;
  public email?: string;
  public name?: string;
  public surname?: string;
  public sourceId?: number;
  public stateId?: number;
  public subStateId?: number;
  public startDate?: string;
  public endDate?: string;
  public maxResult?: number;
}
