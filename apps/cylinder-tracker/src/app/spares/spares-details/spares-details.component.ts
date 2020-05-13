import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cylinder } from '@cedar-angular/api-interfaces';

@Component({
  selector: 'cylinder-tracker-spares-details',
  templateUrl: './spares-details.component.html',
  styleUrls: ['./spares-details.component.css']
})
export class SparesDetailsComponent {
  currentCylinder: Cylinder;
  origionalTitle;
  epaGasCodes = ['NOX', 'SO2', 'O2'];
  measurementTypes = ['ppm', 'ppb'];
  @Output() saved = new EventEmitter();
  @Output() cancelled = new EventEmitter();

  // Make a copy of the cylinder object to avoid shared state anytime cylinder is set.
  @Input() set cylinder(value) {
    if(value) this.origionalTitle = value.cylinderID;
    this.currentCylinder = Object.assign({}, value);
  }

  gasCodeChange(event, gasCode) {
    if(event.checked) {
      this.currentCylinder.epaGasCodes.push(gasCode);
    }
    else {
      this.currentCylinder.epaGasCodes = this.currentCylinder.epaGasCodes.filter(code => code !== gasCode);
    }
  }

  getMeasurementValue(code) {
    const gas = this.currentCylinder.componentGases.filter(gas => gas.name === code)
    return gas.length > 0  ? gas[0].amount : '';
  }

  getMeasurementType(code) {
    const gas = this.currentCylinder.componentGases.filter(gas => gas.name === code)
    return gas.length > 0 ? gas[0].amountType : '';
  }

  measurementValueChange(event, code) {
    this.currentCylinder.componentGases.filter(gas => gas.name === code)[0].amount = event.target.value;

  }

  measurementTypeChange(event, code) {
    this.currentCylinder.componentGases.filter(gas => gas.name === code)[0].amountType = event.value;
  }

 }
