import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { 
  AuthService,
  CylindersFacade,
  UserService,
  GasProfilesFacade,
  UnitDefsFacade,
  CylinderTrackerFacade,
  Cylinder,
  QAGasProfile,
  UnitDef,
  CylinderTrackerAppState
} from '@cedar-all/core-data';
import { User } from '@cedar-angular/api-interfaces';

@Component({
  selector: 'cedar-angular-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {  
  title = "Cylinder Manager";
  currentUser: User;
  cylinders$: Observable<Cylinder[]> = this.cylindersFacade.allCylinders$;
  gasProfiles$: Observable<QAGasProfile[]> = this.gasProfilesFacade.allGasProfiles$;
  users: User[];
  unitDefs$: Observable<UnitDef[]> = this.unitDefsFacade.allUnitDefs$;
  cylinderTrackerState$: Observable<CylinderTrackerAppState[]> = this.cylinderTrackerFacade.cylinderTrackerAppState$;

  links = [
    { path: '/', icon: 'home', title: 'Home'},
    { path: '/cylinders', icon: 'face', title: 'Cylinders'}
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private cylindersFacade: CylindersFacade,
    private userService: UserService,
    private gasProfilesFacade: GasProfilesFacade,
    private unitDefsFacade: UnitDefsFacade,
    private cylinderTrackerFacade: CylinderTrackerFacade
  ) {
    this.authService.currentUser$.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.cylinderTrackerFacade.loadCylinderTrackerState();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isSidenaveOpen(component, authentication) {
    return component.opened && authentication;
  }

  reversePanels() {
    const currentState = this.getCylinderTrackerState();
    this.cylinderTrackerFacade.updateCylinderTrackerState({
      panelsReversed: !currentState.panelsReversed
    })
  }

  getCylinderTrackerState() {
    let cylinderTrackerStateOutput: CylinderTrackerAppState[] = [];
    const cylinderTrackerOBS = this.cylinderTrackerState$.subscribe(state => {
      cylinderTrackerStateOutput = state;
    });
    cylinderTrackerOBS.unsubscribe();
    return cylinderTrackerStateOutput[0];
  }
}
