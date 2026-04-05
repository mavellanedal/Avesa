import { Lead } from '@models/lead/lead';

export class WelcomeLead {
  public newLeadsToday?: number;
  public hotLeadsNotSql?: number;
  public conversionRate?: number;
  public topLeads?: Lead[];
}
