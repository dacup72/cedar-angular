import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ui-ui-toolbar',
  templateUrl: './ui-toolbar.component.html',
  styleUrls: ['./ui-toolbar.component.scss']
})
export class UiToolbarComponent {
  @Input() title;
  @Output() toggleSidenav = new EventEmitter();
}
