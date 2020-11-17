import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cylinder, QAGasProfile } from '@cedar-all/core-data';

@Component({
  selector: 'cylinder-tracker-assign-cylinders',
  templateUrl: './assign-cylinders.component.html',
  styleUrls: ['./assign-cylinders.component.scss']
})
export class AssignCylindersComponent {
  inUseCylinders: Cylinder[];
  gasProfiles: QAGasProfile[];

  @Input() set cylinders(value: Cylinder[]) {
    if(value) this.inUseCylinders = value.filter(c => c.state === 'inUse')
  }
  @Input() set qaGasProfiles(value: QAGasProfile[]) {
    if(value) {
      console.log(value)
      this.gasProfiles = value;
    }
  }
  @Output() cylinderDropped = new EventEmitter();
  @Output() cylinderSelected = new EventEmitter();
  @Output() cylinderDeleted = new EventEmitter();
}
