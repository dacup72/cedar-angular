import { Component, Input, Output, EventEmitter } from '@angular/core';
import { 
  Cylinder, 
  QAGasProfile, 
  CylinderFilters, 
  GasProfileFilters, 
  CrossCardFilters,
  UnitDef, 
  emptyCylinderFilters, 
  emptyGasProfileFilters,
  emptyCrossCardFilters  
} from '@cedar-all/core-data';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'cylinder-tracker-assign-cylinders',
  templateUrl: './assign-cylinders.component.html',
  styleUrls: ['./assign-cylinders.component.scss']
})
export class AssignCylindersComponent {
  inUseCylinders: Cylinder[];
  gasProfiles: QAGasProfile[];
  unitNames: string[] = [];
  cylinderIDs: string[] = [];
  units: UnitDef[] = [];
  cylAssignedProfiles = {};
  testTypes: string[] = [];
  clearFilterItems: boolean = false;

  gasTypes = ['SO2', 'NO', 'NO2', 'NOX', 'N2O', 'CO2', 'CO', 'O2', 'PPN', 'CH4', 'HE', 'H2S', 'BALA', 'BALN', 'APPVD', 'AIR', 'SRM', 'NTRM', 'GMIS', 'RGM', 'PRM', 'ZERO'];
  isAssignedCylinder = true;
  filterForOtherCard = false;

  cylinderFilters: CylinderFilters = cloneDeep(emptyCylinderFilters);
  gasProfileFilters: GasProfileFilters = cloneDeep(emptyGasProfileFilters);
  crossCardFilters: CrossCardFilters = cloneDeep(emptyCrossCardFilters);

  @Input('crossCardFilters') set filters(value) {
    if(value.gasCodes.length) {
      this.filterForOtherCard = true;
      this.crossCardFilters = value;
    }
  }
  @Input() set cylinders(value: Cylinder[]) {
    if(value) this.inUseCylinders = value.filter(c => c.state === 'inUse')
    this.cylinderIDs = value.map(c => c.cylinderID);
    if(this.inUseCylinders.length) this.findAssignedProfiles();
  }
  @Input() set qaGasProfiles(value: QAGasProfile[]) {
    if(value) {
      this.gasProfiles = value;
    }
    value.forEach(gas => {
      if(!this.testTypes.includes(gas.analyzerSpanType)) {
        this.testTypes.push(gas.analyzerSpanType);
      }
      if(!this.testTypes.includes(gas.cedarGasCode)) {
        this.testTypes.push(gas.cedarGasCode);
      }
      if(!this.testTypes.includes(gas.qaTestType)) {
        this.testTypes.push(gas.qaTestType);
      }
    })
    value.forEach(gas => {
      if(!this.testTypes.includes(gas.desc)) {
        this.testTypes.push(gas.desc);
      }
    })
    if(this.inUseCylinders.length) this.findAssignedProfiles();
  }
  @Input() set unitDefs(value: UnitDef[]) {
    if(value) {
      this.units = value;
      value.forEach(unit => {
        this.unitNames.push(unit.name);
      })
    }
  }
  @Output() cylinderDropped = new EventEmitter();
  @Output() cylinderSelected = new EventEmitter();
  @Output() unassignCylinder = new EventEmitter();
  @Output() retireCylinder = new EventEmitter();
  @Output() editCylinder = new EventEmitter();
  @Output('filterOtherCard') filterOtherCard = new EventEmitter();
  @Output('swapCards') swapCards = new EventEmitter();

  gasTypeSelected(gases) {
    // TODO: change this to better detect property change and refrsh component without copying object
    this.cylinderFilters.gasCodes = gases;
    this.gasProfileFilters.gasCodes = gases;
    this.refreshFiltersVariable();
  }

  // unitNameSelected(event) {
  //   const unitNum = typeof(event) === 'string' ? event : this.units.filter(unit => unit.name === event.option.value)[0].id;
  //   this.cylinderFilters.unitNumber = unitNum ? unitNum : '';
  //   this.gasProfileFilters.unitNumber = unitNum ? unitNum : '';
  //   this.refreshFiltersVariable();
  // }

  unitNameSelected(unitNames) {
    const unitIDs = [];
    unitNames.forEach(name => {
      unitIDs.push(this.units.filter(unit => unit.name === name)[0].id);
    })
    this.cylinderFilters.unitIDs = unitIDs;
    this.gasProfileFilters.unitIDs = unitIDs;
    this.refreshFiltersVariable();
  }

  refreshFiltersVariable() {
    this.filterForOtherCard = false;
    this.cylinderFilters = cloneDeep(this.cylinderFilters);
    this.gasProfileFilters = cloneDeep(this.gasProfileFilters);
  }

  clearFilters() {
    this.filterForOtherCard = false;
    this.cylinderFilters = cloneDeep(emptyCylinderFilters);
    this.crossCardFilters = cloneDeep(emptyCrossCardFilters);
    this.gasProfileFilters = cloneDeep(emptyGasProfileFilters);
    this.clearFilterItems = !this.clearFilterItems;
    // TODO: find better way to clear items
  }

  // testTypeSelected(event) {
  //   const testType = typeof(event) === 'string' ? event : event.option.value;
  //   this.cylinderFilters.testType = testType ? testType : '';
  //   this.gasProfileFilters.testType = testType ? testType : '';
  //   this.refreshFiltersVariable();
  // }

  testTypeSelected(testTypeSelections) {
    this.cylinderFilters.testType = testTypeSelections;
    this.gasProfileFilters.testType = testTypeSelections;
    this.refreshFiltersVariable();
  }

  findAssignedProfiles() {
    let assignedProfiles = {};
    this.inUseCylinders.forEach(cyl => {
      assignedProfiles[cyl.cylinderID] = this.gasProfiles.filter(gasProfile => gasProfile.cylID === cyl.cylinderID);
    })
    
    for (const cyl in assignedProfiles) {
      if(assignedProfiles[cyl] && assignedProfiles[cyl].length) {
        let unitArray = [];
        assignedProfiles[cyl].forEach(profile => {
          let found = false;
          for (let i = 0; i < unitArray.length; i++) {
            if(unitArray[i]['unit'] === profile.unit) {
              unitArray[i]['desc'] += `,   ${profile.desc}`;
              found = true;
            }
          }
          if(!found) {
            unitArray.push({
              unit: profile.unit,
              desc: `${profile.desc}`
            })
          }
        })
        assignedProfiles[cyl] = unitArray;
      }
    }

    this.cylAssignedProfiles = assignedProfiles;
  }
}
