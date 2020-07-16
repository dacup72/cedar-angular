import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cylinder } from '@cedar-angular/api-interfaces';

@Component({
  selector: 'cylinder-tracker-spares-list2',
  templateUrl: './spares-list.component.html',
  styleUrls: ['./spares-list.component.css']
})
export class SparesListComponent {
  @Input() cylinders: Cylinder[];
  @Input() readonly = false;
  @Output() selected = new EventEmitter();
  @Output() deleted = new EventEmitter();
}
