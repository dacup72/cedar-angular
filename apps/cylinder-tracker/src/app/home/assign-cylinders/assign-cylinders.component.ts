import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cylinder, QAGasProfile, CylinderFilters, GasProfileFilters, UnitDef } from '@cedar-all/core-data';
//import * as Moment from 'moment';

@Component({
  selector: 'cylinder-tracker-assign-cylinders',
  templateUrl: './assign-cylinders.component.html',
  styleUrls: ['./assign-cylinders.component.scss']
})
export class AssignCylindersComponent {
  inUseCylinders: Cylinder[];
  gasProfiles: QAGasProfile[];
  unitNums: string[] = [];
  cylinderIDs: string[] = [];
  units: UnitDef[] = [];

  filterItemName = 'Gas Type';
  gasTypes = ['SO2', 'NO', 'NO2', 'NOX', 'N2O', 'CO2', 'CO', 'O2', 'PPN', 'CH4', 'HE', 'H2S', 'BALA', 'BALN', 'APPVD', 'AIR', 'SRM', 'NTRM', 'GMIS', 'RGM', 'PRM', 'ZERO'];
  selectTitleCylinder = 'Unit #';
  isAssignedCylinder = true;
  filterForOtherCard = false;

  cylinderFilters: CylinderFilters = {
    cylinderID: '',
    gasCodes: [],
    unitNumber: ''
  }
  gasProfileFilters: GasProfileFilters = {
    gasCodes: [],
    unitNumber: ''
  }
  crossCardFilters = {
    gasCodes: [],
    filterItem: ''
  }

  @Input('crossCardFilters') set filters(value) {
    if(value.gasCodes.length) {
      this.filterForOtherCard = true;
      this.crossCardFilters = value;
    }
  }
  @Input() set cylinders(value: Cylinder[]) {
    if(value) this.inUseCylinders = value.filter(c => c.state === 'inUse')
    this.cylinderIDs = value.map(c => c.cylinderID);
  }
  @Input() set qaGasProfiles(value: QAGasProfile[]) {
    if(value) {
      this.gasProfiles = value;
    }
    value.forEach(gas => {
      if(!this.unitNums.includes(gas.unit.toString())) {
        this.unitNums.push(gas.unit.toString());
      }
    })
  }
  @Input() set unitDefs(value: UnitDef[]) {
    if(value) {
      this.units = value;
    }
  }
  @Output() cylinderDropped = new EventEmitter();
  @Output() cylinderSelected = new EventEmitter();
  @Output() unassignCylinder = new EventEmitter();
  @Output() retireCylinder = new EventEmitter();
  @Output() editCylinder = new EventEmitter();
  @Output('filterOtherCard') filterOtherCard = new EventEmitter();

  gasTypeSelected(gases) {
    // TODO: change this to better detect property change and refrsh component without copying object
    this.cylinderFilters.gasCodes = gases;
    this.gasProfileFilters.gasCodes = gases;
    this.refreshFiltersVariable();
  }

  unitNumSelected(event) {
    const unitNum = typeof(event) === 'string' ? event : event.option.value;
    this.cylinderFilters.unitNumber = unitNum ? unitNum : '';
    this.gasProfileFilters.unitNumber = unitNum ? unitNum : '';
    this.refreshFiltersVariable();
  }

  refreshFiltersVariable() {
    this.filterForOtherCard = false;
    this.cylinderFilters = Object.assign({}, this.cylinderFilters);
    this.gasProfileFilters = Object.assign({}, this.gasProfileFilters);
  }

  clearFilters() {
    this.filterForOtherCard = false;
    this.cylinderFilters = Object.assign({}, {
      'cylinderID': '',
      'gasCodes': [],
      'unitNumber': ''
    })
    this.crossCardFilters = Object.assign({}, {
      gasCodes: [],
      filterItem: ''
    })
    this.gasProfileFilters = Object.assign({}, {
      gasCodes: [],
      unitNumber: ''
    })
  }
}
