import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CylinderUnassignDialogComponent } from './cylinder-unassign-dialog.component';

describe('CylinderUnassignDialogComponent', () => {
  let component: CylinderUnassignDialogComponent;
  let fixture: ComponentFixture<CylinderUnassignDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CylinderUnassignDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CylinderUnassignDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
