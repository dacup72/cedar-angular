import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ui-ui-toolbar',
  templateUrl: './ui-toolbar.component.html',
  styleUrls: ['./ui-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiToolbarComponent {
  @Input() title;
  @Input() isLoggedIn;
  @Output() toggleSidenav = new EventEmitter();
  @Output() logout = new EventEmitter();
}
