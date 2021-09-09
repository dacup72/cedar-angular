import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CylinderTrackerAppState } from '@cedar-all/core-data';

const BASE_URL = '/api/cylinderTrackerState';

@Injectable({
  providedIn: 'root'
})
export class CylinderTrackerStateService {

  constructor(private httpClient: HttpClient) { }

  getUrl() {
    return `${BASE_URL}`;
  }

  getCylinderTrackerState() {
    return this.httpClient.get<CylinderTrackerAppState[]>(this.getUrl());
  }

  updateCylinderTrackerState(CylinderTrackerState: CylinderTrackerAppState) {
    return this.httpClient.patch(this.getUrl(), CylinderTrackerState);
  }
}
