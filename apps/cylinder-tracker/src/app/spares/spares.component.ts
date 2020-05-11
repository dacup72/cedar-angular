import { Component, OnInit } from '@angular/core';
import { CylindersService } from '@cedar-all/core-data';
import { Cylinder } from '@cedar-angular/api-interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'cylinder-tracker-spares',
  templateUrl: './spares.component.html',
  styleUrls: ['./spares.component.css']
})
export class SparesComponent implements OnInit {
  selectedCylinder: Cylinder;
  primaryColor = 'red';
  cylinders$;

  constructor(private cylindersService: CylindersService) { }

  ngOnInit(): void {
    this.getCylinders();
    this.resetCylinder();
  }

  selectCylinder(cylinder) {
    this.selectedCylinder = cylinder;
  }

  getCylinders() {
    this.cylinders$ = this.cylindersService.getAllCylinders();
  }

  deleteCylinder(cylinder) {
    this.cylindersService.deleteCylinder(cylinder.id)
      .subscribe(result => this.getCylinders());
  }

  cancel() {
    this.resetCylinder();
    
  }

  createCylinder(cylinder) {
    this.cylindersService.createCylinder(cylinder)
      .subscribe(result => {
        this.getCylinders();
        this.resetCylinder();
      })
  }

  updateCylinder(cylinder) {
    this.cylindersService.updateCylinder(cylinder.id, cylinder)
      .subscribe(result => {
        this.getCylinders();
        this.resetCylinder();
      })
  }

  saveCylinder(cylinder) {
    if(cylinder.id) {
      this.updateCylinder(cylinder);
    }
    else {
      this.createCylinder(cylinder);
    }
  }

  resetCylinder() {
    const emptyCylinder: Cylinder = {
      id: null,
      title: '',
      details: '',
      percentComplete: 0,
      approved: false
    }
    this.selectCylinder(emptyCylinder);
  }
  
}
