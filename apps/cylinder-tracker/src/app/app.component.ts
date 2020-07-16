import { Component } from '@angular/core';

@Component({
  selector: 'cedar-angular-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {  
  title = "Cylinder Project";
  links = [
    { path: '/', icon: 'home', title: 'Home'},
    { path: '/spares', icon: 'face', title: 'Spares'}
  ];
}
