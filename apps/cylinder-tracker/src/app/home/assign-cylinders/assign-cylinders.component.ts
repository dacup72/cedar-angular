import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ViewChild, 
  ElementRef,
  AfterViewInit,
  AfterContentChecked
} from '@angular/core';
import { 
  Cylinder, 
  QAGasProfile, 
  CylinderFilters, 
  GasProfileFilters, 
  UnitDef, 
  emptyCylinderFilters, 
  emptyGasProfileFilters
} from '@cedar-all/core-data';
import { 
  cloneDeep as _cloneDeep,
  remove as _remove,
  concat as _concat
} from 'lodash';

@Component({
  selector: 'cylinder-tracker-assign-cylinders',
  templateUrl: './assign-cylinders.component.html',
  styleUrls: ['./assign-cylinders.component.scss']
})
export class AssignCylindersComponent implements AfterContentChecked {
  inUseCylinders: Cylinder[];
  gasProfiles: QAGasProfile[];
  unitNames: string[] = [];
  cylinderIDs: string[] = [];
  units: UnitDef[] = [];
  cylAssignedProfiles = {};
  testTypes: string[] = [];
  clearFilterItems: boolean = false;
  gasProfileListEmpty: boolean = false;
  cylindersListEmpty: boolean = false;

  gasTypes = ['NO', 'NO2', 'NOX', 'CO', 'O2', 'SO2', 'CO2', 'N2O', 'PPN', 'CH4', 'HE', 'H2S', 'BALA', 'BALN', 'APPVD', 'AIR', 'SRM', 'NTRM', 'GMIS', 'RGM', 'PRM', 'ZERO'];
  commonGasTypes = ['NO', 'NO2', 'NOX', 'CO', 'O2', 'SO2', 'CO2', 'N2O', 'PPN', 'CH4', 'HE', 'H2S'];

  cylinderFilters: CylinderFilters = _cloneDeep(emptyCylinderFilters);
  gasProfileFilters: GasProfileFilters = _cloneDeep(emptyGasProfileFilters);

  ngAfterContentChecked() {
    if(this.gasProfileElementList) {
      this.gasProfileListEmpty = this.gasProfileElementList.nativeElement['firstChild']['children'].length === 0;
    }
    if(this.inServiceCylindersElementList) {
      this.cylindersListEmpty = this.inServiceCylindersElementList.nativeElement['firstChild']['children'].length === 0;
    }
  }

  @Input('crossCardFilters') set filters(value) {
    if(value && value.cylinderFilters.gasCodes.length) {
      this.cylinderFilters = _cloneDeep(value.cylinderFilters);
      this.gasFilterChipsCylinders['items'] = [];

      this.cylinderFilters.gasCodes.forEach(gas => {
        if(this.commonGasTypes.includes(gas) && !this.gasFilterChipsCylinders['items'].includes(gas)){
          this.gasFilterChipsCylinders['items'].push(gas);
        }
      })
    }

    if(value && value.gasProfileFilters.gasCodes.length) {
      this.gasProfileFilters = _cloneDeep(value.gasProfileFilters);
      this.gasFilterChipsGasProfiles['items'] = [];

      this.gasProfileFilters.gasCodes.forEach(gas => {
        if(this.commonGasTypes.includes(gas) && !this.gasFilterChipsGasProfiles['items'].includes(gas)){
          this.gasFilterChipsGasProfiles['items'].push(gas);
        }
      })
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
      if(gas.qaTestType === 'LIN') {
        if(!this.testTypes.includes('LINEARITY')) {
          this.testTypes.push('LINEARITY');
        }
      }
      else if(!this.testTypes.includes(gas.qaTestType)) {
        this.testTypes.push(gas.qaTestType);
      }
    })
    value.forEach(gas => {
      if(!this.testTypes.includes(gas.desc)) {
        this.testTypes.push(gas.desc);
      }
    })
    if(this.inUseCylinders.length) this.findAssignedProfiles();
    if(this.testTypes.length) this.testTypes = [...this.testTypes];
  }
  @Input() set unitDefs(value: UnitDef[]) {
    if(value) {
      this.units = value;
      value.forEach(unit => {
        this.unitNames.push(unit.name);
      })
      if(this.unitNames.length) this.unitNames = [...this.unitNames];
    }
  }
  @Output() cylinderDropped = new EventEmitter();
  @Output() cylinderSelected = new EventEmitter();
  @Output() unassignCylinder = new EventEmitter();
  @Output() retireCylinder = new EventEmitter();
  @Output() editCylinder = new EventEmitter();
  @Output('filterOtherCard') filterOtherCard = new EventEmitter();

  @ViewChild('gasFilterChipsCylinders') gasFilterChipsCylinders: ElementRef;
  @ViewChild('gasFilterChipsGasProfiles') gasFilterChipsGasProfiles: ElementRef;
  @ViewChild('gasProfileElementList') gasProfileElementList: ElementRef;
  @ViewChild('inServiceCylindersElementList') inServiceCylindersElementList: ElementRef;

  cylindersGasTypeSelected(gases) {
    this.cylinderFilters.gasCodes = gases;
    gases.forEach(gas => {
      if(!(this.cylinderFilters.singleConcentrations.filter(conc => conc.cedarGasCode === gas).length > 0)) {
        this.addNewSingleConcentration(gas, 'cylindersList');
      }
    })
    this.cylinderFilters.singleConcentrations = this.cylinderFilters.singleConcentrations.filter(conc => gases.includes(conc.cedarGasCode));
    this.refreshFiltersVariables();
  }

  gasProfilesGasTypeSelected(gases) {
    this.gasProfileFilters.gasCodes = gases;
    gases.forEach(gas => {
      if(!(this.gasProfileFilters.singleConcentrations.filter(conc => conc.cedarGasCode === gas).length > 0)) {
        this.addNewSingleConcentration(gas, 'gasProfilesList');
      }
    })
    this.gasProfileFilters.singleConcentrations = this.gasProfileFilters.singleConcentrations.filter(conc => gases.includes(conc.cedarGasCode));
    this.refreshFiltersVariables();
  }

  cylindersUnitNameSelected(unitNames) {
    this.cylinderFilters.unitIDs = this.getUnitIDsFromNames(unitNames);
    this.refreshFiltersVariables();
  }

  gasProfilesUnitNameSelected(unitNames) {
    this.gasProfileFilters.unitIDs = this.getUnitIDsFromNames(unitNames);
    this.refreshFiltersVariables();
  }

  cylindersTestTypeSelected(testTypeSelections) {
    this.cylinderFilters.testType = testTypeSelections;
    this.refreshFiltersVariables();
  }

  gasProfilesTestTypeSelected(testTypeSelections) {
    this.gasProfileFilters.testType = testTypeSelections;
    this.refreshFiltersVariables();
  }

  getUnitIDsFromNames(unitNames) {
    const unitIDs = [];
    unitNames.forEach(name => {
      unitIDs.push(this.units.filter(unit => unit.name === name)[0].id);
    });
    return unitIDs;
  }

  clearFilters() {
    this.cylinderFilters = _cloneDeep(emptyCylinderFilters);
    this.gasProfileFilters = _cloneDeep(emptyGasProfileFilters);
    this.clearFilterItems = !this.clearFilterItems;
  }

  refreshFiltersVariables() {
    this.cylinderFilters = _cloneDeep(this.cylinderFilters);
    this.gasProfileFilters = _cloneDeep(this.gasProfileFilters);
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

  deleteSingleConcentration(gasConc, list) {
    if(list === 'cylindersList') _remove(this.cylinderFilters.singleConcentrations, gasConc);
    if(list === 'gasProfilesList') _remove(this.gasProfileFilters.singleConcentrations, gasConc);
    this.refreshFiltersVariables();
  }

  applyGasConcChanges() {
    this.refreshFiltersVariables();
  }

  addNewSingleConcentration(gas: string, list: string) {
    const newSingleConc = {
      cedarGasCode: gas,
      concentration: '',
      uom: '',
      changed: null
    }

    if(list === 'cylindersList') this.cylinderFilters.singleConcentrations.push(newSingleConc);
    if(list === 'gasProfilesList') this.gasProfileFilters.singleConcentrations.push(newSingleConc);
    this.refreshFiltersVariables();
  }

  clearConcInputs(gasConc, list) {
    let chosenList = list === 'cylindersList' ? this.cylinderFilters.singleConcentrations : this.gasProfileFilters.singleConcentrations
    for (let i = 0; i < chosenList.length; i++) {
      let conc = chosenList[i];
      if(conc === gasConc) {
        conc.concentration = null;
        conc.uom = null;
        conc.changed = false;
      }
    }
    this.refreshFiltersVariables();
  }
}
