import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GasProfileItemComponent } from './gas-profile-item.component';

describe('GasProfileItemComponent', () => {
  let component: GasProfileItemComponent;
  let fixture: ComponentFixture<GasProfileItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GasProfileItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GasProfileItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
