import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cylinder, QAGasProfile, UnitDef } from '@cedar-all/core-data';

export interface DialogData {
  cylinder1: Cylinder;
  cylinder2: Cylinder;
  gasProfiles: QAGasProfile[];
  gasProfiles2: QAGasProfile[];
  unitDefs: UnitDef[];
  dropType: string;
  isLastAssignedGasProfile: boolean
}

@Component({
  selector: 'cylinder-tracker-cylinder-drop-dialog',
  templateUrl: './cylinder-drop-dialog.component.html',
  styleUrls: ['./cylinder-drop-dialog.component.scss']
})
export class CylinderDropDialogComponent {
  dialogOptions = {
    selectedState: '',
    gasProfilesBeingChanged: [], 
  }
  allGasesSelected = true;
  gasSectionTitle = 'Select Gas Profiles To Replace';
  commonGasTypes = ['SO2', 'NO', 'NO2', 'NOX', 'N2O', 'CO2', 'CO', 'O2', 'PPN', 'CH4', 'HE', 'H2S'];
  checkBoxConnections = {}

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private dialogRef: MatDialogRef<CylinderDropDialogComponent>) {
    this.dialogOptions.gasProfilesBeingChanged = this.data.gasProfiles.map(gasProfile => gasProfile.tagID);
    this.dialogOptions.selectedState = data.cylinder1.state === 'spare' ? 'retired' : null;
    if(data.dropType === 'inUse to inUseDropList') {
      this.gasSectionTitle = 'Gas Profiles Being Swapped';
    }
    else if(data.dropType.includes('gasProfileDropList')) {
      this.gasSectionTitle = 'Gas Profile Being Updated';
      this.allGasesSelected = data.isLastAssignedGasProfile;

      if(!data.isLastAssignedGasProfile) {
        this.dialogOptions.selectedState = 'inUse';
      }
    }

    data.gasProfiles.forEach(gas => {
      if(!this.checkBoxConnections[gas.profileGroupKey]) {
        this.checkBoxConnections[gas.profileGroupKey] = true;
      }
    })
  }

  gasSelectionChange(event) {
    const checkBoxName = event.source.name;
    
    if(event.checked && !this.dialogOptions.gasProfilesBeingChanged.includes(checkBoxName)) {
      this.dialogOptions.gasProfilesBeingChanged.push(checkBoxName);
    }
    else if(!event.checked) {
      this.dialogOptions.gasProfilesBeingChanged = this.dialogOptions.gasProfilesBeingChanged.filter(gasProfileName => gasProfileName !== checkBoxName);
    }

    this.allGasesSelected = this.data.gasProfiles.length === this.dialogOptions.gasProfilesBeingChanged.length;
    if(!this.allGasesSelected) {
      this.dialogOptions.selectedState = 'inUse';
    }
    else {
      this.dialogOptions.selectedState = 'retired';
    }
  }

  close() {
    this.dialogRef.close();
  }

  isConcentrationValid(gasProfile: QAGasProfile, cylNum: string = 'cylinder1') {
    const cylGas = this.data[cylNum].componentGases.filter(gas => {
      const cylGasEPA = gas.epaGasCode.toLowerCase();
      const cylGasQA = gas.qaGasDefCode.toLowerCase();
      const gasProfileCode = gasProfile.cedarGasCode.toLowerCase();

      if(cylGasEPA === 'no' 
        && (gasProfileCode === 'no' || gasProfileCode === 'nox' || gasProfileCode === 'no2')
      ) return true;
      else if(cylGasQA === 'nox' 
        && (gasProfileCode === 'no' || gasProfileCode === 'nox' || gasProfileCode === 'no2')
      ) return true;
      else return false;
    })[0];
    let concMsg = `[${gasProfile.allowableGasValueMin} - ${gasProfile.allowableGasValueMax} ${gasProfile.uom}]`;
    if(gasProfile.allowableGasValueMin2) {
      concMsg += ` or [${gasProfile.allowableGasValueMin2} - ${gasProfile.allowableGasValueMax2} ${gasProfile.uom}]`;
    }

    if(cylGas 
      && ((cylGas.gasConcentration <= parseInt(gasProfile.allowableGasValueMax) && cylGas.gasConcentration >= parseInt(gasProfile.allowableGasValueMin))
      || cylGas.gasConcentration <= parseInt(gasProfile.allowableGasValueMax2) && cylGas.gasConcentration >= parseInt(gasProfile.allowableGasValueMin2))
      ) {
      return '';
    }
    else if(!cylGas) {
      return `-  Cylinder: ${this.data[cylNum].cylinderID} does not have ${gasProfile.cedarGasCode}.`;
    }
    else {
      return `-  Cylinder: ${this.data[cylNum].cylinderID} does not have the correct ${gasProfile.cedarGasCode} concentration. ${concMsg}`;
    }
  }

  getUnitName(unitID) {
    const matchedUnit = this.data.unitDefs.filter(unit => unit.id === unitID)[0];
    return matchedUnit ? matchedUnit.name : 'Unit name not found';
  }
}
