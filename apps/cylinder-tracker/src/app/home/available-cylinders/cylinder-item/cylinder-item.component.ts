import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cylinder, QAGasProfile, UnitDef } from '@cedar-all/core-data';

@Component({
  selector: 'cylinder-tracker-cylinder-item',
  templateUrl: './cylinder-item.component.html',
  styleUrls: ['./cylinder-item.component.scss']
})
export class CylinderItemComponent {
  gasProfileCols = ['unit', 'desc'];
  commonGasTypes = ['NO', 'NO2', 'NOX', 'CO', 'O2', 'SO2', 'CO2', 'N2O', 'PPN', 'CH4', 'HE', 'H2S'];

  gasColors = {
    $cylindertrackerso2: '#9DCC5F',
    $cylindertrackerso2text: 'black',
    $cylindertrackerso2secondary: '#8E5FCC',
    $cylindertrackerso2secondarytext: 'white',
    $cylindertrackerno: '#36D6E7',
    $cylindertrackernotext: 'black',
    $cylindertrackernosecondary: '#E74736',
    $cylindertrackernosecondarytext: 'black',
    $cylindertrackerno2: '#9BCCFD',
    $cylindertrackerno2text: 'black',
    $cylindertrackerno2secondary: '#FDCC9B',
    $cylindertrackerno2secondarytext: 'black',
    $cylindertrackernox: '#0074DD',
    $cylindertrackernoxtext: 'white',
    $cylindertrackernoxsecondary: '#DD6900',
    $cylindertrackernoxsecondarytext: 'black',
    $cylindertrackern2o: '#81599F',
    $cylindertrackern2otext: 'white',
    $cylindertrackern2osecondary: '#779F59',
    $cylindertrackern2osecondarytext: 'black',
    $cylindertrackerco2: '#FD7F20',
    $cylindertrackerco2text: 'black',
    $cylindertrackerco2secondary: '#209EFD',
    $cylindertrackerco2secondarytext: 'black',
    $cylindertrackerco: '#FDB750',
    $cylindertrackercotext: 'black',
    $cylindertrackercosecondary: '#5096FD',
    $cylindertrackercosecondarytext: 'black',
    $cylindertrackero2: '#335120',
    $cylindertrackero2text: 'white',
    $cylindertrackero2secondary: '#3E2051',
    $cylindertrackero2secondarytext: 'white',
    $cylindertrackerppn: '#660A60',
    $cylindertrackerppntext: 'white',
    $cylindertrackerppnsecondary: '#0A6610',
    $cylindertrackerppnsecondarytext: 'white',
    $cylindertrackerch4: '#FF5C4D',
    $cylindertrackerch4text: 'black',
    $cylindertrackerch4secondary: '#4DF0FF',
    $cylindertrackerch4secondarytext: 'black',
    $cylindertrackerhe: '#FFCD58',
    $cylindertrackerhetext: 'black',
    $cylindertrackerhesecondary: '#588AFF',
    $cylindertrackerhesecondarytext: 'black',
    $cylindertrackerh2s: '#FF5C4D',
    $cylindertrackerh2stext: 'black',
    $cylindertrackerh2ssecondary: '#4DF0FF',
    $cylindertrackerh2ssecondarytext: 'black',
  }
    // TODO find better way to make dynamic colors for gases

  
  @Input('cylinder') cylinder: Cylinder;
  @Input('gasProfiles') gasProfiles: QAGasProfile[] = [];
  @Input() units: UnitDef[];
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

  getGasColor(gas) {
    return this.gasColors[`$cylindertracker${gas}`];
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
}

