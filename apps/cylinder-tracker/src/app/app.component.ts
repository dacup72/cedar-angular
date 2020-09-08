import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@cedar-all/core-data';
import { User } from '@cedar-angular/api-interfaces';

@Component({
  selector: 'cedar-angular-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {  
  title = "Cylinder Tracker";
  currentUser: User;

  links = [
    { path: '/', icon: 'home', title: 'Home'},
    { path: '/spares', icon: 'face', title: 'Spares'}
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {

  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isSidenaveOpen(component, authentication) {
    return component.opened && authentication;
  }
}
