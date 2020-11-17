import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCylindersComponent } from './assign-cylinders.component';

describe('AssignCylindersComponent', () => {
  let component: AssignCylindersComponent;
  let fixture: ComponentFixture<AssignCylindersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignCylindersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignCylindersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
