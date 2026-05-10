import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "@envs/environment";
import { WelcomeLeadFilter } from "@models/welcome/welcome-lead-filter";

@Injectable({providedIn: "root"})
export class WelcomeService {
  private readonly http = inject(HttpClient);

  getWelcomwLead(filter: WelcomeLeadFilter | undefined = undefined) {
    return this.http.post(environment.api + '/lead/getLeadsWelcome', filter);
  }
}
