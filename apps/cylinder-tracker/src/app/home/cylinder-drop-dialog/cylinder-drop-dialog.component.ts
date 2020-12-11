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
  replacingGasProfiles = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private dialogRef: MatDialogRef<CylinderDropDialogComponent>) {
    this.replacingGasProfiles = this.data.gasProfiles.map(gasProfile => gasProfile.name);
  }

  gasSelectionChange(event) {
    const checkBoxName = event.source.name;
    
    if(event.checked && !this.replacingGasProfiles.includes(checkBoxName)) {
      this.replacingGasProfiles.push(checkBoxName);
    }
    else if(!event.checked) {
      this.replacingGasProfiles = this.replacingGasProfiles.filter(gasProfileName => gasProfileName !== checkBoxName);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
