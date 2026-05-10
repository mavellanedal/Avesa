import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '@envs/environment';
import {Source} from '@models/source-tracking/source';

@Injectable({
  providedIn: 'root'
})
export class SourceTrackingService {
  private readonly http = inject(HttpClient);

  getLightSources() {
    return this.http.post<Source[]>(environment.api + '/source/getLightSources', undefined);
  }
}
