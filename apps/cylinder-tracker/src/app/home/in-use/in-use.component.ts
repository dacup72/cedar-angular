import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Cylinder } from '@cedar-angular/api-interfaces';

@Component({
  selector: 'cylinder-tracker-in-use',
  templateUrl: './in-use.component.html',
  styleUrls: ['./in-use.component.css']
})
export class InUseComponent {
  inUseCylinders: Cylinder[];
  cylinderCountUpdated: boolean = false;

  @Input() set cylinders(value: Cylinder[]) {
    if(value.length > 0 && !this.cylinderCountUpdated) { 
      this.inUseCylinders = value.filter(c => c.status === 'inUse')
      this.cylinderCountUpdated = true;
    }
  }
  @Input() readonly = false;
  @Output() dropped = new EventEmitter();
  @Output() selected = new EventEmitter();
  @Output() deleted = new EventEmitter();
}
