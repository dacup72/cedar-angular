import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message, Cylinder } from '@cedar-angular/api-interfaces';

@Component({
  selector: 'cedar-angular-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  hello$ = this.http.get<Cylinder>('/api/cylinder/0');
  
  title = "Cylinder Project";
  links = [
    { path: '/', icon: 'home', title: 'Home'},
    { path: '/spares', icon: 'face', title: 'Spares'},
    { path: '/inuse', icon: 'work', title: 'In Use'},
    { path: '/globs', icon: 'work', title: 'Globs'},
  ];

  constructor(private http: HttpClient) {}
}
