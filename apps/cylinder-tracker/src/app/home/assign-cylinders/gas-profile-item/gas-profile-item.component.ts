import { Component, Input, Output, EventEmitter } from '@angular/core';
import { QAGasProfile } from '@cedar-all/core-data';

@Component({
  selector: 'cylinder-tracker-gas-profile-item',
  templateUrl: './gas-profile-item.component.html',
  styleUrls: ['./gas-profile-item.component.scss']
})
export class GasProfileItemComponent {

  constructor() { }
  counter = 0;

  @Input() gasProfiles: QAGasProfile[];

  @Output() cylinderDropped = new EventEmitter();
  //@Output() unassignGasProfile = new EventEmitter();

  gasDropListID() {
    this.counter++;
    return 'gasProfileDropList' + this.counter;
  }

}
