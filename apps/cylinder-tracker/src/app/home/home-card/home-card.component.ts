import { Component, Input } from '@angular/core';

@Component({
  selector: 'cylinder-tracker-home-card',
  templateUrl: './home-card.component.html',
  styleUrls: ['./home-card.component.scss']
})
export class HomeCardComponent {
  @Input('cardTitle') cardTitle: string;

}
