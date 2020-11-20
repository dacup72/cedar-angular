import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cylinder, QAGasProfile } from '@cedar-all/core-data';

@Component({
  selector: 'cylinder-tracker-cylinder-item',
  templateUrl: './cylinder-item.component.html',
  styleUrls: ['./cylinder-item.component.scss']
})
export class CylinderItemComponent {

  constructor() { }

  @Input() cylinder: Cylinder;
  @Input() gasProfiles: QAGasProfile[] = [];
  @Input() isAssignedCylinder: boolean;
  @Input() disableItemDrag = false;
  @Output() cylinderDropped = new EventEmitter();
  //@Output() cylinderSelected = new EventEmitter();
  @Output() cylinderDeleted = new EventEmitter();

  findAssignedGasProfiles(cylinder: Cylinder) {
    if(this.gasProfiles.length > 0) {
      return this.gasProfiles.filter(gasProfile => gasProfile.cylinderID === cylinder.cylinderID);
    } 
    return [];
  }

}

