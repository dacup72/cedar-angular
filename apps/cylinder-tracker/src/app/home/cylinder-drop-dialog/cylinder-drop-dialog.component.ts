import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cylinder, QAGasProfile } from '@cedar-all/core-data';

export interface DialogData {
  cylinder1: Cylinder;
  cylinder2: Cylinder;
  gasProfiles: QAGasProfile[];
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
  //isConcValidTicker = 0;


  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private dialogRef: MatDialogRef<CylinderDropDialogComponent>) {
    this.dialogOptions.gasProfilesBeingChanged = this.data.gasProfiles.map(gasProfile => gasProfile.tagID);
    this.dialogOptions.selectedState = data.cylinder1.state === 'spare' ? 'retired' : null;
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
  }

  close() {
    this.dialogRef.close();
  }

  isConcentrationValid(gasProfile: QAGasProfile) {
    const cylGas = this.data.cylinder1.componentGases.filter(gas => gas.qaGasDefCode === gasProfile.cedarGasCode)[0];

    if(cylGas && cylGas.gasConcentration <= parseInt(gasProfile.allowableGasValueMax) && cylGas.gasConcentration >= parseInt(gasProfile.allowableGasValueMin)) {
      return '';
    }
    else if(!cylGas) {
      return `-  Cylinder: ${this.data.cylinder1.cylinderID} does not have ${gasProfile.cedarGasCode}.`;
    }
    else {
      return `-  Cylinder: ${this.data.cylinder1.cylinderID} does not have the correct gas concentration.`;
    }
  }
}
