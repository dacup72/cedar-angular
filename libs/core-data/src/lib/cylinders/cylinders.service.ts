import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cylinder } from './cylinder.model';

const BASE_URL = '/api/cylinder';

@Injectable({
  providedIn: 'root'
})
export class CylindersService {

  constructor(private httpClient: HttpClient) { }

  getUrl() {
    return `${BASE_URL}`;
  }

  getUrlForId(id: string) {
    return `${this.getUrl()}/${id}`;
  }

  getAllCylinders() {
    return this.httpClient.get<Cylinder[]>(this.getUrl());
  }

  getSingleCylinder(id: string) {
    return this.httpClient.get<Cylinder>(this.getUrlForId(id));
  }

  createCylinder(cylinder: Cylinder) {
    return this.httpClient.post(this.getUrl(), cylinder);
  }

  updateCylinder(cylinder: Cylinder) {
    return this.httpClient.patch(this.getUrlForId(cylinder.id), cylinder);
  }

  deleteCylinder(cylinder: Cylinder) {
    return this.httpClient.delete(this.getUrlForId(cylinder.id));
  }
}
