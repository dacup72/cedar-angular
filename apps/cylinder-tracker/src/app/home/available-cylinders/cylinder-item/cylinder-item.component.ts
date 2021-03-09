import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cylinder, QAGasProfile, UnitDef } from '@cedar-all/core-data';

@Component({
  selector: 'cylinder-tracker-cylinder-item',
  templateUrl: './cylinder-item.component.html',
  styleUrls: ['./cylinder-item.component.scss']
})
export class CylinderItemComponent {
  panelOpenState = false;


  gasProfileCols = ['unit', 'desc'];
  commonGasTypes = ['NO', 'NO2', 'NOX', 'CO', 'O2', 'SO2', 'CO2', 'N2O', 'PPN', 'CH4', 'HE', 'H2S'];

  
  @Input('cylinder') cylinder: Cylinder;
  @Input('gasProfiles') gasProfiles: QAGasProfile[] = [];
  @Input('units') units: UnitDef[];
  @Input('existingGasTypes') existingGasTypes: string[] = [];
  @Input('isAssignedCylinder') isAssignedCylinder: boolean;
  @Input('disableItemDrag') disableItemDrag = false;
  @Input('cylAssignedProfiles') cylAssignedProfiles = {};
  @Output('cylinderDropped') cylinderDropped = new EventEmitter();
  @Output('retireCylinder') retireCylinder = new EventEmitter();
  @Output('editCylinder') editCylinder = new EventEmitter();
  @Output('filterOtherCard') filterOtherCard = new EventEmitter();
  @Output('createSimilarCyl') createSimilarCyl = new EventEmitter();




  findAssignedGasProfiles(cylinder: Cylinder) {
    if(this.gasProfiles.length > 0) {
      return this.gasProfiles.filter(gasProfile => gasProfile.cylID === cylinder.cylinderID);
    } 
    return [];
  }

  parseDate(dateString: string) {
    return Date.parse(dateString);
  }

  getGasProfileForID(id) {
    if(this.cylAssignedProfiles[id]) {
      return this.cylAssignedProfiles[id];
    }
    else {
      return [];
    }
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

  getUnitName(unitID) {
    const matchedUnit = this.units.filter(unit => unit.id === unitID)[0];
    return matchedUnit ? matchedUnit.name : 'Unit name not found';
  }

  getGasValue(gas) {
    let result = '';
    this.cylinder.componentGases.forEach(g => {
      if(g.epaGasCode === gas) {
        result = g.gasConcentration.toString() + ' ' + g.uom;
      }
    })
    return result;
  }
}

