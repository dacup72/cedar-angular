import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ui-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent {

  constructor() { }

  @Input() datePickerTitle = 'Default Title';
  @Output() dateSelected = new EventEmitter();

}
