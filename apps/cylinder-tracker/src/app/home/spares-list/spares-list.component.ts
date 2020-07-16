import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Cylinder } from '@cedar-angular/api-interfaces';

@Component({
  selector: 'cylinder-tracker-spares-list',
  templateUrl: './spares-list.component.html',
  styleUrls: ['./spares-list.component.css']
})
export class SparesListComponent {
  spareCylinders: Cylinder[];
  cylinderCountUpdated: boolean = false;

  @Input() set cylinders(value: Cylinder[]) {
    if(value.length > 0 && !this.cylinderCountUpdated) { 
      this.spareCylinders = value.filter(c => c.status === 'spare')
      this.cylinderCountUpdated = true;
    }
  }
  @Input() readonly = false;
  @Output() dropped = new EventEmitter();
  @Output() selected = new EventEmitter();
  @Output() deleted = new EventEmitter();
}
