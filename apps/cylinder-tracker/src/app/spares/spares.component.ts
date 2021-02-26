import { Component, OnInit } from '@angular/core';
import { CylindersFacade, Cylinder } from '@cedar-all/core-data';
import { Observable } from 'rxjs';

@Component({
  selector: 'cylinder-tracker-spares',
  templateUrl: './spares.component.html',
  styleUrls: ['./spares.component.scss']
})
export class SparesComponent implements OnInit {
  selectedCylinder$: Observable<Cylinder> = this.cylindersFacade.selectedCylinder$;
  cylinders$: Observable<Cylinder[]> = this.cylindersFacade.allCylinders$;

  constructor(private cylindersFacade: CylindersFacade) {}

  ngOnInit(): void {
    this.cylindersFacade.loadCylinders();
    this.cylindersFacade.mutations$.subscribe(_ => this.resetSelectedCylinder());
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
}
