import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CylinderRetireDialogComponent } from './cylinder-retire-dialog.component';

describe('CylinderRetireDialogComponent', () => {
  let component: CylinderRetireDialogComponent;
  let fixture: ComponentFixture<CylinderRetireDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CylinderRetireDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CylinderRetireDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
