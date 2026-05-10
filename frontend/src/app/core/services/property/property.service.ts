import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "@envs/environment";
import { PropertyFilter } from "@models/property/property-filter";

@Injectable({providedIn: "root"})
export class PropertyService {
  private readonly http = inject(HttpClient);

  getWelcomwLead(filter: PropertyFilter | undefined = undefined) {
    return this.http.post(environment.api + '/property/getProperties', filter);
  }
}
