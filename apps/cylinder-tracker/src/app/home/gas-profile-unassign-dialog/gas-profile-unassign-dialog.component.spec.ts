import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GasProfileUnassignDialogComponent } from './gas-profile-unassign-dialog.component';

describe('GasProfileUnassignDialogComponent', () => {
  let component: GasProfileUnassignDialogComponent;
  let fixture: ComponentFixture<GasProfileUnassignDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GasProfileUnassignDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GasProfileUnassignDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
