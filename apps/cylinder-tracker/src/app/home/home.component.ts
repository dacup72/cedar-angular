import { Component, OnInit } from '@angular/core';
import { CylindersFacade, Cylinder, GasProfilesFacade, QAGasProfile } from '@cedar-all/core-data';
import { Observable } from 'rxjs';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { User } from '@cedar-angular/api-interfaces';
import { UserService } from '@cedar-all/core-data';
import { first } from 'rxjs/operators';

@Component({
  selector: 'cylinder-tracker-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  selectedCylinder$: Observable<Cylinder> = this.cylindersFacade.selectedCylinder$;
  cylinders$: Observable<Cylinder[]> = this.cylindersFacade.allCylinders$;
  gasProfiles$: Observable<QAGasProfile[]> = this.gasProfilesFacade.allGasProfiles$;
  users: User[];
  loading = false;

  constructor(
    private cylindersFacade: CylindersFacade, 
    private userService: UserService, 
    private gasProfilesFacade: GasProfilesFacade
  ) {}

  ngOnInit(): void {
    // INIT CYLINDERS
    this.cylindersFacade.loadCylinders();
    this.cylindersFacade.mutations$.subscribe(_ =>
      this.resetSelectedCylinder()
    );
    this.resetSelectedCylinder();

    // INIT GAS PROFILES
    this.gasProfilesFacade.loadGasProfiles();
    this.gasProfilesFacade.mutations$.subscribe(_ =>
      this.resetSelectedGasProfile()
    );
    this.resetSelectedCylinder();

    // INIT USERS
    this.loading = true;
    this.userService.getAll().pipe(first()).subscribe(users => {
        this.loading = false;
        this.users = users;
    });
  }

  // CYLINDERS ACTIONS
  resetSelectedCylinder() {
    this.selectCylinder({ id: null });
  }

  selectCylinder(cylinder) {
    this.cylindersFacade.selectCylinder(cylinder.id);
  }

  saveCylinder(cylinder) {
    if (cylinder.id) {
      this.cylindersFacade.updateCylinder(cylinder);
    } else {
      this.cylindersFacade.createCylinder(cylinder);
    }
  }

  deleteCylinder(cylinder) {
    this.cylindersFacade.deleteCylinder(cylinder);
  }


  // GAS PROFILES ACTIONS
  resetSelectedGasProfile() {
    this.selectGasProfle({ id: null });
  }

  selectGasProfle(gasProfile) {
    this.gasProfilesFacade.selectGasProfile(gasProfile.id);
  }

  // CYLINDER DRAG AND DROP EVENT
  cylinderDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer !== event.container) {
      const droppedCylinder = Object.assign(
        {},
        event.previousContainer.data[event.previousIndex]
      );

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      switch (event.container.id) {
        case 'sparesDropList':
          droppedCylinder['state'] = 'spare';
          break;
        case 'inUseDropList':
          droppedCylinder['state'] = 'inUse';
          break;
        case 'globDropList':
          droppedCylinder['state'] = 'glob';
          break;
        default:
          break;
      }

      this.saveCylinder(droppedCylinder);
    }
  }
}
