import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const BASE_URL = '/api/cylinder';

@Injectable({
  providedIn: 'root'
})
export class CylindersService {

  constructor(private httpClient: HttpClient) { }

  getAllCylinders() {
    return this.httpClient.get(BASE_URL);
  }

  getSingleCylinder(id: string) {
    return this.httpClient.get(`${BASE_URL}/${id}`);
  }

  createCylinder(cylinder) {
    return this.httpClient.post(BASE_URL, cylinder);
  }

  updateCylinder(id: string, updates) {
    return this.httpClient.patch(`${BASE_URL}/${id}`, updates);
  }

  deleteCylinder(id: string) {
    return this.httpClient.delete(`${BASE_URL}/${id}`);
  }
}
