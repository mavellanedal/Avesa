import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "@envs/environment";
import { PropertyFilter } from "@models/property/property-filter";
import { Property } from "@models/property/property";
import {ResponseData} from '@models/response-data';
import {PropertyStateHistory} from '@models/property/property-state-history';
import {PropertyState} from '@models/property/property-state';
import {PropertyType} from '@models/property/property-type';

@Injectable({providedIn: "root"})
export class PropertyTrackingService {
  private readonly http = inject(HttpClient);

  getProperties(filter: PropertyFilter) {
    return this.http.post<ResponseData<Property[]>>(environment.api +'/property/getProperties', filter);
  }

  getPropertyStateHistories(propertyId: string) {
    return this.http.post<PropertyStateHistory[]>(environment.api + '/property/getPropertyStateHistories', { propertyId });
  }

  getPropertyStates() {
    return this.http.post<PropertyState[]>(environment.api + '/property/getPropertyStates', undefined);
  }

  getPropertyTypes() {
    return this.http.post<PropertyType[]>(environment.api + '/property/getPropertyTypes', undefined);
  }
}
