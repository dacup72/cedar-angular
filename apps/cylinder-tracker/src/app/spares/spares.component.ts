import { Component, OnInit } from '@angular/core';
import { CylindersFacade, Cylinder } from '@cedar-all/core-data';
import { Observable } from 'rxjs';


@Component({
  selector: 'cylinder-tracker-spares',
  templateUrl: './spares.component.html',
  styleUrls: ['./spares.component.css']
})
export class SparesComponent implements OnInit {
  selectedCylinder$: Observable<Cylinder> = this.cylindersFacade.selectedCylinder$;
  cylinders$: Observable<Cylinder[]> = this.cylindersFacade.allCylinders$;
  
  constructor(
    private cylindersFacade: CylindersFacade
  ) { }

  ngOnInit() {
    this.cylindersFacade.loadCylinders();
    this.cylindersFacade.mutations$.subscribe(_ => this.resetSelectedCylinder());
    this.resetSelectedCylinder();
  }

  resetSelectedCylinder() {
    this.selectCylinder({id: null});
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
}


