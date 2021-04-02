import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterContentChecked } from '@angular/core';
import { 
  Cylinder, 
  QAGasProfile, 
  CylinderFilters,
  UnitDef, 
  emptyCylinderFilters
} from '@cedar-all/core-data';
import { 
  cloneDeep as _cloneDeep,
  remove as _remove 
} from 'lodash';

@Component({
  selector: 'cylinder-tracker-available-cylinders',
  templateUrl: './available-cylinders.component.html',
  styleUrls: ['./available-cylinders.component.scss']
})
export class AvailableCylindersComponent implements AfterContentChecked {
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
  cylindersListEmpty: boolean = false;

  gasTypes = ['NO', 'NO2', 'NOX', 'CO', 'O2', 'SO2', 'CO2', 'N2O', 'PPN', 'CH4', 'HE', 'H2S', 'BALA', 'BALN', 'APPVD', 'AIR', 'SRM', 'NTRM', 'GMIS', 'RGM', 'PRM', 'ZERO'];
  commonGasTypes = ['NO', 'NO2', 'NOX', 'CO', 'O2', 'SO2', 'CO2', 'N2O', 'PPN', 'CH4', 'HE', 'H2S'];
  existingGasTypes = [];

  cylinderFilters: CylinderFilters = _cloneDeep(emptyCylinderFilters);
  
  // TODO: ngAfterContentChecked gets called too often, find better fix
  @ViewChild('scroller') scroller: ElementRef;
  @ViewChild('cylindersElementList') cylindersElementList: ElementRef;
  scrollBarVisible = true;
  measureScrollWindow(scrollHeight, viewPortHeight) {
    this.scrollBarVisible = scrollHeight > viewPortHeight;
  }
  ngAfterContentChecked(): void {
    if(this.scroller) {
      this.measureScrollWindow(this.scroller['_totalContentSize'], this.scroller['_viewportSize']);
      this.cylindersListEmpty = this.scroller['_dataLength'] < 1;
    } 
  }


  @Input('crossCardFilters') set filters(value) {
    if(value && value.cylinderFilters.gasCodes.length) {
      this.cylinderFilters = _cloneDeep(value.cylinderFilters);
      this.gasFilterChips['items'] = [];

      this.cylinderFilters.gasCodes.forEach(gas => {
        if(this.commonGasTypes.includes(gas) && !this.gasFilterChips['items'].includes(gas)){
          this.gasFilterChips['items'].push(gas);
        }
      })
    }
  }
  @Input() set cylinders(value: Cylinder[]) {
    if(value) {
      this.spareCylinders = value.filter(c => c.state === 'spare');
      this.inUseCylinders = value.filter(c => c.state === 'inUse');
      this.allCylinders = [...this.spareCylinders, ...this.inUseCylinders];

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
  @Output('cylinderDropped') cylinderDropped = new EventEmitter();
  @Output('cylinderSelected') cylinderSelected = new EventEmitter();
  @Output('retireCylinder') retireCylinder = new EventEmitter();
  @Output('filterOtherCard') filterOtherCard = new EventEmitter();
  @Output('editCylinder') editCylinder = new EventEmitter();
  @Output('savedSuccess') savedSuccess = new EventEmitter();
  @Output('createSimilarCyl') createSimilarCyl = new EventEmitter();

  @ViewChild('gasFilterChips') gasFilterChips: ElementRef;

  gasTypeSelected(gases) {
    this.cylinderFilters.gasCodes = gases;
    gases.forEach(gas => {
      if(!(this.cylinderFilters.concentrations.filter(conc => conc.cedarGasCode === gas).length > 0)) {
        this.addNewConcentration(gas);
      }
    })
    this.cylinderFilters.concentrations = this.cylinderFilters.concentrations.filter(conc => gases.includes(conc.cedarGasCode));
    this.refreshFiltersVariables();
  }

  cylinderStateSelected(event) {
    const cylinderState = typeof(event) === 'string' ? event : event.option.value;
    this.cylinderFilters.state = cylinderState ? cylinderState : '';
    this.refreshFiltersVariables();
  }

  refreshFiltersVariables() {
    this.cylinderFilters = _cloneDeep(this.cylinderFilters);
  }

  clearFilters() {
    this.cylinderFilters = _cloneDeep(emptyCylinderFilters);
    this.clearFilterItems = !this.clearFilterItems;
  }

  trackCylinder(index, cylinder: Cylinder) {
    return cylinder ? cylinder.id : undefined;
  }

  findAssignedProfiles() {
    let assignedProfiles = {};
    if(this.gasProfiles) {
      this.inUseCylinders.forEach(cyl => {
        assignedProfiles[cyl.cylinderID] = this.gasProfiles.filter(gasProfile => gasProfile.cylID === cyl.cylinderID);
      })
    }
    
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
    this.filterOtherCard.emit($event);
  }

  onGasHeaderClick(gas) {
    if(!this.gasFilterChips['items'].includes(gas)) {
      this.gasFilterChips['items'].push(gas);
    }
    if(!this.cylinderFilters.gasCodes.includes(gas)) {
      this.cylinderFilters.gasCodes.push(gas)
    }
    if(!(this.cylinderFilters.concentrations.filter(conc => conc.cedarGasCode === gas).length > 0)) {
      this.addNewConcentration(gas);
    }
    this.refreshFiltersVariables();
  }

  addNewConcentration(gas: string) {
    this.cylinderFilters.concentrations.push({
      cedarGasCode: gas,
      allowableGasValueMin: '',
      allowableGasValueMax: '',
      uom: '',
      changed: false
    })
  }

  deleteConcentration(gasConc) {
    _remove(this.cylinderFilters.concentrations, gasConc);
    this.refreshFiltersVariables();
  }

  clearConcInputs(gasConc) {
    for (let i = 0; i < this.cylinderFilters.concentrations.length; i++) {
      let conc = this.cylinderFilters.concentrations[i];
      if(conc === gasConc) {
        conc.allowableGasValueMax = null;
        conc.allowableGasValueMax = null;
        conc.changed = false;
      }
    }
    this.refreshFiltersVariables();
  }
}
