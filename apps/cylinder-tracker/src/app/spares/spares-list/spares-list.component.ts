import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cylinder } from '@cedar-all/core-data';

@Component({
  selector: 'cylinder-tracker-spares-list2',
  templateUrl: './spares-list.component.html',
  styleUrls: ['./spares-list.component.css']
})
export class SparesListComponent {
  spareCylinders: Cylinder[];

  @Input() set cylinders(value: Cylinder[]) {
    if(value) this.spareCylinders = value.filter(c => c.status === 'spare')
  }
  @Input() readonly = false;
  @Output() selected = new EventEmitter();
  @Output() deleted = new EventEmitter();
}
