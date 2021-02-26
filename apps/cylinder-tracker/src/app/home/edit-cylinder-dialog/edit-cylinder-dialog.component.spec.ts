import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCylinderDialogComponent } from './edit-cylinder-dialog.component';

describe('EditCylinderDialogComponent', () => {
  let component: EditCylinderDialogComponent;
  let fixture: ComponentFixture<EditCylinderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCylinderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCylinderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
