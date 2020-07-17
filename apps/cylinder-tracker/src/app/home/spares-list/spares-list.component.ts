import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Cylinder } from '@cedar-angular/api-interfaces';

@Component({
  selector: 'cylinder-tracker-spares-list',
  templateUrl: './spares-list.component.html',
  styleUrls: ['./spares-list.component.css']
})
export class SparesListComponent {
  spareCylinders: Cylinder[];

  @Input() set cylinders(value: Cylinder[]) {
    if(value) this.spareCylinders = value.filter(c => c.status === 'spare')
  }
  @Input() readonly = false;
  @Output() dropped = new EventEmitter();
  @Output() selected = new EventEmitter();
  @Output() deleted = new EventEmitter();
  
}
