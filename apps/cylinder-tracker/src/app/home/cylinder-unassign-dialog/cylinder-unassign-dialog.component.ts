import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cylinder, QAGasProfile } from '@cedar-all/core-data';

export interface DialogData {
  cylinder: Cylinder;
  gasProfiles: QAGasProfile[];
}

@Component({
  selector: 'cylinder-tracker-cylinder-unassign-dialog',
  templateUrl: './cylinder-unassign-dialog.component.html',
  styleUrls: ['./cylinder-unassign-dialog.component.scss']
})
export class CylinderUnassignDialogComponent {
  // TODO: Update the logic of this dialog to work in html with angular directives

  gasProfileSelections = {};

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private dialogRef: MatDialogRef<CylinderUnassignDialogComponent>) {
    data.gasProfiles.forEach(gasProfile => this.gasProfileSelections[gasProfile.tagID] = true)
  }

  close() {
    this.dialogRef.close();
  }

  changeBool(gasProfileID) {
    this.gasProfileSelections[gasProfileID] = !this.gasProfileSelections[gasProfileID];
  }
}
