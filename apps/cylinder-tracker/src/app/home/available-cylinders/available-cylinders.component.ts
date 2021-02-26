import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cylinder, QAGasProfile, CylinderFilters } from '@cedar-all/core-data';
//import * as Moment from 'moment';

@Component({
  selector: 'cylinder-tracker-available-cylinders',
  templateUrl: './available-cylinders.component.html',
  styleUrls: ['./available-cylinders.component.scss']
})
export class AvailableCylindersComponent {
  spareCylinders: Cylinder[];
  inUseCylinders: Cylinder[];
  gasProfiles: QAGasProfile[];
  cylinderIDs: string[] = [];
  unitNums: string[] = [];
  dropListConnections: string[] = [];
  cylAssignedProfiles = {};
  testTypes: string[] = [];
  clearFilterItems: boolean = false;

  gasTypes = ['SO2', 'NO', 'NO2', 'NOX', 'N2O', 'CO2', 'CO', 'O2', 'PPN', 'CH4', 'HE', 'H2S', 'BALA', 'BALN', 'APPVD', 'AIR', 'SRM', 'NTRM', 'GMIS', 'RGM', 'PRM', 'ZERO'];
  filtersForSpares = true;
  filterForOtherCard = false;

  cylinderFilters: CylinderFilters = {
    cylinderID: '',
    gasCodes: [],
    unitNumber: '',
    testType: ''
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
    if(value) {
      this.spareCylinders = value.filter(c => c.state === 'spare');
      this.inUseCylinders = value.filter(c => c.state === 'inUse');
      for (let i = 0; i < this.inUseCylinders.length; i++) {
        this.dropListConnections.push('inUseDropList' + i);
      }
      this.cylinderIDs = value.map(c => c.cylinderID);
      this.savedSuccess.emit('Cylinder Saved Successfully')
    }
  }
  @Input() set qaGasProfiles(value: QAGasProfile[]) {
    if(value) {
      for (let i = 0; i < value.length; i++) {
        this.dropListConnections.push('gasProfileDropList' + i);
      }
      this.gasProfiles = value;
      value.forEach(gas => {
        if(!this.unitNums.includes(gas.unit.toString())) {
          this.unitNums.push(gas.unit.toString());
        }
        if(!this.testTypes.includes(gas.desc)) {
          this.testTypes.push(gas.desc);
        }
      })
      this.findAssignedProfiles();
    }
  }
  @Output() cylinderDropped = new EventEmitter();
  @Output() cylinderSelected = new EventEmitter();
  @Output() retireCylinder = new EventEmitter();
  @Output('filterOtherCard') filterOtherCard = new EventEmitter();
  @Output('editCylinder') editCylinder = new EventEmitter();
  @Output('savedSuccess') savedSuccess = new EventEmitter();
  @Output('createSimilarCyl') createSimilarCyl = new EventEmitter();

  gasTypeSelected(gases) {
    // TODO: change this to better detect property change and refresh component without copying object
    this.cylinderFilters.gasCodes = gases;
    this.refreshFiltersVariable();
  }

  cylinderIDSelected(event) {
    const cylinderID = typeof(event) === 'string' ? event : event.option.value;
    this.cylinderFilters.cylinderID = cylinderID ? cylinderID : '';
    this.refreshFiltersVariable();
  }

  unitNumSelected(event) {
    const unitNum = typeof(event) === 'string' ? event : event.option.value;
    this.cylinderFilters.unitNumber = unitNum ? unitNum : '';
    this.refreshFiltersVariable();
  }

  testTypeSelected(event) {
    const testType = typeof(event) === 'string' ? event : event.option.value;
    this.cylinderFilters.testType = testType ? testType : '';
    this.refreshFiltersVariable();
  }

  refreshFiltersVariable() {
    this.filterForOtherCard = false;
    this.cylinderFilters = Object.assign({}, this.cylinderFilters);
  }

  tabChanged(currentTab) {
    if(currentTab === 'Spare Cylinders') {
      this.filtersForSpares = true;
    }
    else {
      this.filtersForSpares = false;
    }

    this.cylinderFilters = Object.assign({}, {
      cylinderID: '',
      gasCodes: this.cylinderFilters.gasCodes,
      unitNumber: '',
      testType: ''
    })
  }

  clearFilters() {
    this.filterForOtherCard = false;
    this.cylinderFilters = Object.assign({}, {
      cylinderID: '',
      gasCodes: [],
      unitNumber: '',
      testType: ''
    })
    this.crossCardFilters = Object.assign({}, {
      gasCodes: [],
      filterItem: ''
    })
    this.clearFilterItems = !this.clearFilterItems;
    // TODO: find better way to clear items
  }

  trackCylinder(index, cylinder: Cylinder) {
    return cylinder ? cylinder.id : undefined;
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
