import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cylinder, emptyCylinder } from '@cedar-all/core-data';
import { ComponentGas } from '@cedar-angular/api-interfaces';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'cylinder-tracker-spares-details',
  templateUrl: './spares-details.component.html',
  styleUrls: ['./spares-details.component.scss']
})
export class SparesDetailsComponent {
  currentCylinder: Cylinder;
  origionalTitle: string;
  epaGasTypeCodes = ['NO', 'NO2', 'NOX', 'SO2', 'O2'];
  measurementTypes = ['ppm', '%'];
  @Output() saved = new EventEmitter();
  @Output() cancelled = new EventEmitter();

  // Make a copy of the cylinder object to avoid shared state anytime cylinder is set.
  @Input() set cylinder(value: Cylinder) {
    if(value) this.origionalTitle = value.cylinderID; 
    this.currentCylinder = cloneDeep(value);
  }

  gasCodeChange(event, gasCode) {
    if(event.checked) {
      this.currentCylinder.epaGasTypeCodes = this.currentCylinder.epaGasTypeCodes.concat([gasCode]);
      const emptyComponentGas: ComponentGas = {
        qaGasDefCode: null,
        epaGasCode: gasCode,
        gasConcentration: null,
        uom: null
      }
      this.currentCylinder.componentGases = this.currentCylinder.componentGases.concat([emptyComponentGas]);
    }
    else {
      this.currentCylinder.epaGasTypeCodes = this.currentCylinder.epaGasTypeCodes.filter(code => code !== gasCode);
      this.currentCylinder.componentGases = this.currentCylinder.componentGases.filter(gas => gas.epaGasCode !== gasCode);
    }
  }

  getMeasurementValue(componentGas) {
    const selectedGas = this.currentCylinder.componentGases.filter(gas => gas.epaGasCode === componentGas);
    return selectedGas.length > 0  ? selectedGas[0].gasConcentration : '';
  }

  getMeasurementType(componentGas) {
    const selectedGas = this.currentCylinder.componentGases.filter(gas => gas.epaGasCode === componentGas);
    return selectedGas.length > 0 ? selectedGas[0].uom : '';
  }

  measurementValueChange(event, componentGas) {
    this.currentCylinder.componentGases.filter(gas => gas.epaGasCode === componentGas)[0].gasConcentration = event.target.value;
  }

  measurementTypeChange(event, componentGas) {
    this.currentCylinder.componentGases.filter(gas => gas.epaGasCode === componentGas)[0].uom = event.value;
  }

  resetCurrentCylinder() {
    this.currentCylinder = cloneDeep(emptyCylinder);
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


 
