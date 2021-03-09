import { Component, Input, Output, EventEmitter } from '@angular/core';
import { QAGasProfile, GasProfileFilters, Cylinder, UnitDef } from '@cedar-all/core-data';

@Component({
  selector: 'cylinder-tracker-gas-profile-item',
  templateUrl: './gas-profile-item.component.html',
  styleUrls: ['./gas-profile-item.component.scss']
})
export class GasProfileItemComponent {

  constructor() { }
  counter = 0;
  commonGasTypes = ['NO', 'NO2', 'NOX', 'CO', 'O2', 'SO2', 'CO2', 'N2O', 'PPN', 'CH4', 'HE', 'H2S'];


  @Input() gasProfiles: QAGasProfile[];
  @Input() gasProfileFilters: GasProfileFilters;
  @Input() inUseCylinders: Cylinder[];
  @Input() units: UnitDef[];

  @Output() cylinderDropped = new EventEmitter();
  @Output('filterOtherCard') filterOtherCard = new EventEmitter();

  gasDropListID() {
    this.counter++;
    return 'gasProfileDropList' + this.counter;
  }

  gasSorter(array, key) {
    let resultArr = [...array];

    resultArr.sort((a, b) => {
      var A = a[key], B = b[key];

      if (this.commonGasTypes.indexOf(A) > this.commonGasTypes.indexOf(B)) return 1;
      else return -1;
    });
    
    return resultArr;
  }

  findAssignedCyl(cylinderID) {
    return this.inUseCylinders.filter(c => c.cylinderID === cylinderID);
  }

  parseDate(dateString: string) {
    return Date.parse(dateString);
  }

  getUnitName(unitID) {
    const matchedUnit = this.units.filter(unit => unit.id === unitID)[0];
    return matchedUnit ? matchedUnit.name : 'Error: Unit name not found';
  }
}
