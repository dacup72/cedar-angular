import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CylinderItemComponent } from './cylinder-item.component';

describe('CylinderItemComponent', () => {
  let component: CylinderItemComponent;
  let fixture: ComponentFixture<CylinderItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CylinderItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CylinderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
