import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Cylinder } from '@cedar-all/core-data';

@Component({
  selector: 'ui-ui-toolbar',
  templateUrl: './ui-toolbar.component.html',
  styleUrls: ['./ui-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiToolbarComponent {
  allCylinders: Cylinder[];

  @Input() title;
  @Input() isLoggedIn;
  @Output() toggleSidenav = new EventEmitter();
  @Output() logout = new EventEmitter();
  @Output() reversePanels = new EventEmitter();

  @Input() set cylinders(value: Cylinder[]) {
    if(value) {
      this.allCylinders = value;
    }
  }

}
