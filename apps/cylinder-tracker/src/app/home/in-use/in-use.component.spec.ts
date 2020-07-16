import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InUseComponent } from './in-use.component';

describe('InUseComponent', () => {
  let component: InUseComponent;
  let fixture: ComponentFixture<InUseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InUseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
