import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QAGasProfile } from './qa-gas-profile.model';

const BASE_URL = '/api/qaGasProfile';

@Injectable({
  providedIn: 'root'
})
export class QAGasProfileService {

  constructor(private httpClient: HttpClient) { }

  getUrl() {
    return `${BASE_URL}`;
  }

  getUrlForID(id: string) {
    return `${this.getUrl()}/${id}`;
  }

  getAllGasProfiles() {
    return this.httpClient.get<QAGasProfile[]>(this.getUrl());
  }

  updateQAGasProfile(qaGasProfile: QAGasProfile) {
    return this.httpClient.patch(this.getUrlForID(qaGasProfile.id), qaGasProfile);
  }
}
