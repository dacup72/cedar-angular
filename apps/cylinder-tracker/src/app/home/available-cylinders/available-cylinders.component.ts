import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { 
  Cylinder, 
  QAGasProfile, 
  CylinderFilters,
  CrossCardFilters, 
  UnitDef, 
  emptyCylinderFilters, 
  emptyCrossCardFilters 
} from '@cedar-all/core-data';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'cylinder-tracker-available-cylinders',
  templateUrl: './available-cylinders.component.html',
  styleUrls: ['./available-cylinders.component.scss']
})
export class AvailableCylindersComponent {
  allCylinders: Cylinder[];
  spareCylinders: Cylinder[];
  inUseCylinders: Cylinder[];
  gasProfiles: QAGasProfile[];
  units: UnitDef[] = [];
  cylinderIDs: string[] = [];
  unitNames: string[] = [];
  dropListConnections: string[] = [];
  cylAssignedProfiles = {};
  testTypes: string[] = [];
  clearFilterItems: boolean = false;

  testGasRange = [
    {min: '2', max: '8'},
    {min: '26', max: '42'},
    {min: '103', max: '233'},
    {min: '1030', max: '2443'},
  ]

  gasTypes = ['NO', 'NO2', 'NOX', 'CO', 'O2', 'SO2', 'CO2', 'N2O', 'PPN', 'CH4', 'HE', 'H2S', 'BALA', 'BALN', 'APPVD', 'AIR', 'SRM', 'NTRM', 'GMIS', 'RGM', 'PRM', 'ZERO'];
  commonGasTypes = ['NO', 'NO2', 'NOX', 'CO', 'O2', 'SO2', 'CO2', 'N2O', 'PPN', 'CH4', 'HE', 'H2S']
  existingGasTypes = [];
  filtersForSpares = true;
  filterForOtherCard = false;

  cylinderFilters: CylinderFilters = cloneDeep(emptyCylinderFilters);
  crossCardFilters: CrossCardFilters = cloneDeep(emptyCrossCardFilters);

  // TODO: needs to update when data changes 
  scrollBarVisible = true;
  measureScrollWindow(scrollHeight, viewPortHeight) {
    console.log('hello')
    this.scrollBarVisible = scrollHeight !== viewPortHeight;
  }
    

  @Input('crossCardFilters') set filters(value) {
    if(value.gasCodes.length) {
      this.cylinderFilters = cloneDeep(emptyCylinderFilters);
      this.gasFilterChips['items'] = [];

      value.gasCodes.forEach(gas => {
        if(this.commonGasTypes.includes(gas)){
          if(!this.gasFilterChips['items'].includes(gas)) {
            this.gasFilterChips['items'].push(gas);
          }
          if(!this.cylinderFilters.gasCodes.includes(gas)) {
            this.cylinderFilters.gasCodes.push(gas)
          }
        }
      })
      this.cylinderFilters = cloneDeep(this.cylinderFilters);
      //this.filterForOtherCard = true;
      //this.crossCardFilters = value;
    }
  }
  @Input() set cylinders(value: Cylinder[]) {
    if(value) {
      this.allCylinders = value.filter(c => c.state !== 'retired');
      this.spareCylinders = value.filter(c => c.state === 'spare');
      this.inUseCylinders = value.filter(c => c.state === 'inUse');

      value.forEach(c => {
        if(c.state !== 'retired') {
          c.componentGases.forEach(g => {
            if(!this.existingGasTypes.includes(g.epaGasCode)) this.existingGasTypes.push(g.epaGasCode);
          })
        }
      })
      this.existingGasTypes = this.gasSorter(this.existingGasTypes);

      for (let i = 0; i < this.inUseCylinders.length; i++) {
        this.dropListConnections.push('inUseDropList' + i);
      }

      this.cylinderIDs = value.map(c => c.cylinderID);
      this.savedSuccess.emit('Cylinder Saved Successfully');
      if(this.inUseCylinders.length) this.findAssignedProfiles();
    }
  }
  @Input() set qaGasProfiles(value: QAGasProfile[]) {
    if(value) {
      for (let i = 0; i < value.length; i++) {
        this.dropListConnections.push('gasProfileDropList' + i);
      }
      this.gasProfiles = value;
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
      //TODO: this is not consistent in populating the assigned profiles
    }
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
  @Output() retireCylinder = new EventEmitter();
  @Output('filterOtherCard') filterOtherCard = new EventEmitter();
  @Output('editCylinder') editCylinder = new EventEmitter();
  @Output('savedSuccess') savedSuccess = new EventEmitter();
  @Output('createSimilarCyl') createSimilarCyl = new EventEmitter();

  @ViewChild('gasFilterChips') gasFilterChips: ElementRef;

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

  cylinderStateSelected(event) {
    const cylinderState = typeof(event) === 'string' ? event : event.option.value;
    this.cylinderFilters.state = cylinderState ? cylinderState : '';
    this.refreshFiltersVariable();
  }

  // unitNameSelected(event) {
  //   const unitNum = typeof(event) === 'string' ? event : this.units.filter(unit => unit.name === event.option.value)[0].id;
  //   this.cylinderFilters.unitNumber = unitNum ? unitNum : '';
  //   this.refreshFiltersVariable();
  // }

  unitNameSelected(unitNames) {
    const unitIDs = [];
    unitNames.forEach(name => {
      unitIDs.push(this.units.filter(unit => unit.name === name)[0].id);
    })
    this.cylinderFilters.unitIDs = unitIDs;
    this.refreshFiltersVariable();
  }

  // testTypeSelected(event) {
  //   const testType = typeof(event) === 'string' ? event : event.option.value;
  //   this.cylinderFilters.testType = testType ? testType : '';
  //   this.refreshFiltersVariable();
  // }

  testTypeSelected(testTypeSelections) {
    this.cylinderFilters.testType = testTypeSelections;
    this.refreshFiltersVariable();
  }

  refreshFiltersVariable() {
    this.filterForOtherCard = false;
    this.cylinderFilters = cloneDeep(this.cylinderFilters);
  }

  tabChanged(currentTab) {
    if(currentTab === 'Spare Cylinders') {
      this.filtersForSpares = true;
    }
    else {
      this.filtersForSpares = false;
    }

    this.cylinderFilters = cloneDeep(emptyCylinderFilters);
  }

  clearFilters() {
    this.filterForOtherCard = false;
    this.cylinderFilters = cloneDeep(emptyCylinderFilters);
    this.crossCardFilters = cloneDeep(emptyCrossCardFilters);
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


  gasSorter(array) {
    return this.gasTypes.filter(el => array.indexOf(el) > -1);
  }

  filterOtherCardCall($event) {
    //console.log(this.gasFilterChips)
    //this.gasFilterChips['items'].push('SO2')
    this.filterOtherCard.emit($event);
  }

  onGasHeaderClick(gas) {
    if(!this.gasFilterChips['items'].includes(gas)) {
      this.gasFilterChips['items'].push(gas);
    }
    if(!this.cylinderFilters.gasCodes.includes(gas)) {
      this.cylinderFilters.gasCodes.push(gas)
    }
    this.cylinderFilters = cloneDeep(this.cylinderFilters);
  }
}
