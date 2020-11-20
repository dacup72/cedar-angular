import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

}
