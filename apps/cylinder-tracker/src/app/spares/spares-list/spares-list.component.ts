import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Cylinder } from '@cedar-angular/api-interfaces';

@Component({
  selector: 'cylinder-tracker-spares-list',
  templateUrl: './spares-list.component.html',
  styleUrls: ['./spares-list.component.css']
})
export class SparesListComponent {
  @Input() cylinders: Cylinder[];
  @Input() readonly = false;
  @Output() selected = new EventEmitter();
  @Output() deleted = new EventEmitter();
}
