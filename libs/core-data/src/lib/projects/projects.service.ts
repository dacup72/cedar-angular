import { Injectable } from '@angular/core';
import { Project } from './project';
import { HttpClient } from '@angular/common/http';

const BASE_URL = 'http://localhost:3000/';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  model = 'projects';

  constructor(private httpClient: HttpClient) { }

  getUrl() {
    return `${BASE_URL}${this.model}`;
  }

  getUrlForId(id) {
    return `${this.getUrl()}/${id}`;
  }

  all() {
    return this.httpClient.get(this.getUrl());
  }

  create(project) {
    return this.httpClient.post(this.getUrl(), project);
  }

  update(project) {
    return this.httpClient.patch(this.getUrlForId(project.id), project);
  }

  delete(projectId) {
    return this.httpClient.delete(this.getUrlForId(projectId));
  }
}


// {
//   "version": 2,
//   "name": "cylinder-tracker",
//   "builds": [
//     {
//       "src": "/dist/apps/api/main.js",
//       "use": "@now/node"
//     },
//     {
//       "src": "/dist/apps/cylinder-tracker/*",
//       "use": "@now/static"
//     }
//   ],
//   "routes": [
//     {
//       "src": "/api/(.*)",
//       "dest": "/dist/apps/api/main.js"
//     },
//     {
//       "handle": "filesystem"
//     },
//     {
//       "src": "/assets/(.*)",
//       "dest": "/dist/apps/cylinder-tracker/assets/$1"
//     },
//     {
//       "src": "/(.*).(js|css|ico)",
//       "dest": "/dist/apps/cylinder-tracker/$1.$2"
//     },
//     {
//       "src": "/(.*)",
//       "dest": "/dist/apps/cylinder-tracker/index.html"
//     }
//   ]
// }