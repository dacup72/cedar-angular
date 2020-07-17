import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Cylinder } from '@cedar-all/core-data';

@Component({
  selector: 'cylinder-tracker-in-use',
  templateUrl: './in-use.component.html',
  styleUrls: ['./in-use.component.css']
})
export class InUseComponent {
  inUseCylinders: Cylinder[];

  @Input() set cylinders(value: Cylinder[]) {
    if(value) this.inUseCylinders = value.filter(c => c.status === 'inUse')
  }
  @Input() readonly = false;
  @Output() dropped = new EventEmitter();
  @Output() selected = new EventEmitter();
  @Output() deleted = new EventEmitter();
}
