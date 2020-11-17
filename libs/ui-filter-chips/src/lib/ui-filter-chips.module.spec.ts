import { async, TestBed } from '@angular/core/testing';
import { UiFilterChipsModule } from './ui-filter-chips.module';

describe('UiFilterChipsModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiFilterChipsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(UiFilterChipsModule).toBeDefined();
  });
});
