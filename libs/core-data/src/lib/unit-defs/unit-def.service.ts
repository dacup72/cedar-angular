import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UnitDef } from './unit-def.model';

const BASE_URL = '/api/unitDef';

@Injectable({
  providedIn: 'root'
})
export class UnitDefService {

  constructor(private httpClient: HttpClient) { }

  getUrl() {
    return `${BASE_URL}`;
  }

  getAllUnitDefs() {
    return this.httpClient.get<UnitDef[]>(this.getUrl());
  }
}
