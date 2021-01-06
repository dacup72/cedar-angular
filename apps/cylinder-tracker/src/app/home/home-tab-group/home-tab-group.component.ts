import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'cylinder-tracker-home-tab-group',
  templateUrl: './home-tab-group.component.html',
  styleUrls: ['./home-tab-group.component.scss']
})
export class HomeTabGroupComponent {
  defaultLabel = 'Default Label';

  @Input('tabLeftLabel') tabLeftLabel: string = this.defaultLabel;
  @Input('tabRightLabel') tabRightLabel: string = this.defaultLabel;
  @Input('tabMiddleLabel') tabMiddleLabel: string = this.defaultLabel;
  @Input('useMiddleTab') useMiddleTab: boolean = false;
  @Output('selectedTabChange') selectedTabChange = new EventEmitter();
}
