import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cylinder, ComponentGas, emptyCylinder } from '@cedar-all/core-data';

@Component({
  selector: 'cylinder-tracker-spares-details',
  templateUrl: './spares-details.component.html',
  styleUrls: ['./spares-details.component.css']
})
export class SparesDetailsComponent {
  currentCylinder: Cylinder;
  origionalTitle: string;
  epaGasCodes = ['NOX', 'SO2', 'O2'];
  measurementTypes = ['ppm', 'ppb'];
  @Output() saved = new EventEmitter();
  @Output() cancelled = new EventEmitter();

  // Make a copy of the cylinder object to avoid shared state anytime cylinder is set.
  @Input() set cylinder(value: Cylinder) {
    if(value) this.origionalTitle = value.cylinderID; 
    this.currentCylinder = Object.assign({}, value);
  }

  gasCodeChange(event, gasCode) {
    if(event.checked) {
      this.currentCylinder.epaGasCodes = this.currentCylinder.epaGasCodes.concat([gasCode]);
      const emptyComponentGas: ComponentGas = {
        name: gasCode,
        amount: null,
        amountType: null
      }
      this.currentCylinder.componentGases = this.currentCylinder.componentGases.concat([emptyComponentGas]);
    }
    else {
      this.currentCylinder.epaGasCodes = this.currentCylinder.epaGasCodes.filter(code => code !== gasCode);
      this.currentCylinder.componentGases = this.currentCylinder.componentGases.filter(gas => gas.name !== gasCode);
    }
  }

  getMeasurementValue(componentGas) {
    const selectedGas = this.currentCylinder.componentGases.filter(gas => gas.name === componentGas);
    return selectedGas.length > 0  ? selectedGas[0].amount : '';
  }

  getMeasurementType(componentGas) {
    const selectedGas = this.currentCylinder.componentGases.filter(gas => gas.name === componentGas);
    return selectedGas.length > 0 ? selectedGas[0].amountType : '';
  }

  measurementValueChange(event, componentGas) {
    this.currentCylinder.componentGases.filter(gas => gas.name === componentGas)[0].amount = event.target.value;
  }

  measurementTypeChange(event, componentGas) {
    this.currentCylinder.componentGases.filter(gas => gas.name === componentGas)[0].amountType = event.value;
  }

  resetCurrentCylinder() {
    this.currentCylinder = Object.assign({}, emptyCylinder);
  }

  onSubmit() {
    this.saved.emit(this.currentCylinder);
    this.resetCurrentCylinder();
  }

  onCancel() {
    this.cancelled.emit();
    this.resetCurrentCylinder();
  }
 }
