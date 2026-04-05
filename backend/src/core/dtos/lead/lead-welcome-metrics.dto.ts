import { Lead } from '@entities';
export class LeadWelcomeMetricsDto {
  public newLeadsToday: number;
  public hotLeadsNotSql: number;
  public conversionRate: number;
  public topLeads: Lead[];
}
