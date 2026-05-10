import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LeadFilter} from '@models/lead/lead-filter';
import {environment} from '@envs/environment';
import {LeadState} from '@models/lead/lead-state';
import {ResponseData} from '@models/response-data';
import {Lead} from '@models/lead/lead';
import {LeadStateHistory} from '@models/lead/lead-state-history';

@Injectable({
  providedIn: "root"
})
export class LeadTrackingService {
  private readonly http = inject(HttpClient);

  getLeads(leadFilter: LeadFilter) {
    return this.http.post<ResponseData<Lead[]>>(environment.api + '/lead/getLeads', leadFilter);
  }

  getLeadStateHistories(leadId: string) {
    return this.http.post<LeadStateHistory[]>(environment.api + '/lead/getLeadStateHistory', { leadId });
  }

  getLeadStates() {
    return this.http.post<LeadState[]>(environment.api + '/lead/getLeadStates', undefined);
  }
}
