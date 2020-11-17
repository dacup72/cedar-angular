import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cylinder } from '@cedar-all/core-data';

@Component({
  selector: 'cylinder-tracker-cylinder-item',
  templateUrl: './cylinder-item.component.html',
  styleUrls: ['./cylinder-item.component.scss']
})
export class CylinderItemComponent {

  constructor() { }

  @Input() cylinders: Cylinder[];
  @Output() cylinderDropped = new EventEmitter();
  @Output() cylinderSelected = new EventEmitter();
  @Output() cylinderDeleted = new EventEmitter();

}
