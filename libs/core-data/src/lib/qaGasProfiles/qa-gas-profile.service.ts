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

  getUrlForPID(pid: Number) {
    return `${this.getUrl()}/${pid}`;
  }

  getAllGasProfiles() {
    return this.httpClient.get<QAGasProfile[]>(this.getUrl());
  }

  getSingleQAGasProfile(pid: Number) {
    return this.httpClient.get<QAGasProfile>(this.getUrlForPID(pid));
  }

  updateQAGasProfile(qaGasProfile: QAGasProfile) {
    return this.httpClient.patch(this.getUrlForPID(qaGasProfile.pid), qaGasProfile);
  }
}
