import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cylinder } from '@cedar-all/core-data';

@Component({
  selector: 'cylinder-tracker-spares-list',
  templateUrl: './spares-list.component.html',
  styleUrls: ['./spares-list.component.css']
})
export class SparesListComponent {
  spareCylinders: Cylinder[];

  @Input() set cylinders(value: Cylinder[]) {
    if(value) this.spareCylinders = value.filter(c => c.state === 'spare')
  }
  @Input() readonly = false;
  @Output() dropped = new EventEmitter();
  @Output() selected = new EventEmitter();
  @Output() deleted = new EventEmitter();
}
