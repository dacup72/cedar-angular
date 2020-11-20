import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CylinderDropDialogComponent } from './cylinder-drop-dialog.component';

describe('CylinderDropDialogComponent', () => {
  let component: CylinderDropDialogComponent;
  let fixture: ComponentFixture<CylinderDropDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CylinderDropDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CylinderDropDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
