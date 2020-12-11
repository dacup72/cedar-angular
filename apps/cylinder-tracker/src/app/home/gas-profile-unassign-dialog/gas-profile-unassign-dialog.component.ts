import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cylinder } from '@cedar-all/core-data';

export interface DialogData {
  cylinder: Cylinder;
}

@Component({
  selector: 'cylinder-tracker-gas-profile-unassign-dialog',
  templateUrl: './gas-profile-unassign-dialog.component.html',
  styleUrls: ['./gas-profile-unassign-dialog.component.scss']
})
export class GasProfileUnassignDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private dialogRef: MatDialogRef<GasProfileUnassignDialogComponent>) { }

  close() {
    this.dialogRef.close();
  }
}
