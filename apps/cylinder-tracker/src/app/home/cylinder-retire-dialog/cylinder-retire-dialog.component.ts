import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cylinder } from '@cedar-all/core-data';

export interface DialogData {
  cylinder: Cylinder;
}

@Component({
  selector: 'cylinder-tracker-cylinder-retire-dialog',
  templateUrl: './cylinder-retire-dialog.component.html',
  styleUrls: ['./cylinder-retire-dialog.component.scss']
})
export class CylinderRetireDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private dialogRef: MatDialogRef<CylinderRetireDialogComponent>) { }

  close() {
    this.dialogRef.close();
  }
}
