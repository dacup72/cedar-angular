import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cylinder } from '@cedar-angular/api-interfaces';

@Component({
  selector: 'cylinder-tracker-globs',
  templateUrl: './globs.component.html',
  styleUrls: ['./globs.component.css']
})
export class GlobsComponent {
  globCylinders: Cylinder[];

  @Input() set cylinders(value: Cylinder[]) {
    console.log(value)
    if(value) this.globCylinders = value.filter(c => c.status === 'glob')
  }
  @Input() readonly = false;
  @Output() dropped = new EventEmitter();
  @Output() selected = new EventEmitter();
  @Output() deleted = new EventEmitter();
}