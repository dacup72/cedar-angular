import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cylinder } from '@cedar-angular/api-interfaces';

@Component({
  selector: 'cylinder-tracker-spares-details',
  templateUrl: './spares-details.component.html',
  styleUrls: ['./spares-details.component.css']
})
export class SparesDetailsComponent {
  currentCylinder: Cylinder;
  origionalTitle;
  @Output() saved = new EventEmitter();
  @Output() cancelled = new EventEmitter();

  // Make a copy of the cylinder object to avoid shared state anytime cylinder is set.
  @Input() set cylinder(value) {
    if(value) this.origionalTitle = value.title;
    this.currentCylinder = Object.assign({}, value);
  }

 }
