import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableCylindersComponent } from './available-cylinders.component';

describe('AvailableCylindersComponent', () => {
  let component: AvailableCylindersComponent;
  let fixture: ComponentFixture<AvailableCylindersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableCylindersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableCylindersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
