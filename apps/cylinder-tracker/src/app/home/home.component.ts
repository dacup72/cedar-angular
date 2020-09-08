import { Component, OnInit } from '@angular/core';
import { CylindersFacade, Cylinder } from '@cedar-all/core-data';
import { Observable } from 'rxjs';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { User } from '@cedar-angular/api-interfaces';
import { UserService } from '@cedar-all/core-data';
import { first } from 'rxjs/operators';

@Component({
  selector: 'cylinder-tracker-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedCylinder$: Observable<Cylinder> = this.cylindersFacade.selectedCylinder$;
  cylinders$: Observable<Cylinder[]> = this.cylindersFacade.allCylinders$;
  users: User[];
  loading = false;

  constructor(private cylindersFacade: CylindersFacade, private userService: UserService) {}

  ngOnInit(): void {
    this.cylindersFacade.loadCylinders();
    this.cylindersFacade.mutations$.subscribe(_ =>
      this.resetSelectedCylinder()
    );
    this.resetSelectedCylinder();

    this.loading = true;
    this.userService.getAll().pipe(first()).subscribe(users => {
        this.loading = false;
        this.users = users;
    });
  }

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

  drop(event: CdkDragDrop<string[]>) {
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
          droppedCylinder['status'] = 'spare';
          break;
        case 'inUseDropList':
          droppedCylinder['status'] = 'inUse';
          break;
        case 'globDropList':
          droppedCylinder['status'] = 'glob';
          break;
        default:
          break;
      }

      this.saveCylinder(droppedCylinder);
    }
  }
}
