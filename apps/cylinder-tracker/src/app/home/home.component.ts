import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CylindersFacade, Cylinder } from '@cedar-all/core-data';
import { Observable } from 'rxjs';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { SparesListComponent } from './spares-list/spares-list.component';
import { InUseComponent } from './in-use/in-use.component';


@Component({
  selector: 'cylinder-tracker-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedCylinder$: Observable<Cylinder> = this.cylindersFacade.selectedCylinder$;
  cylinders$: Observable<Cylinder[]> = this.cylindersFacade.allCylinders$;
  
  constructor(private cylindersFacade: CylindersFacade) { }

  ngOnInit(): void {
    this.cylindersFacade.loadCylinders();
    this.cylindersFacade.mutations$.subscribe(_ =>
      this.resetSelectedCylinder()
    );
    this.resetSelectedCylinder();
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
    this.cylindersFacade.loadCylinders();
  }

  deleteCylinder(cylinder) {
    this.cylindersFacade.deleteCylinder(cylinder);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer !== event.container) {
      const droppedCylinder = Object.assign({}, event.previousContainer.data[event.previousIndex]);

      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      switch(event.container.id) {
        case 'sparesDropList':
          droppedCylinder['status'] = 'spare';
          break;
        case 'inUseDropList':
          droppedCylinder['status'] = 'inUse';
          break;
        default:
          break;
      }
      
      this.saveCylinder(droppedCylinder);
    } 
  }
}
