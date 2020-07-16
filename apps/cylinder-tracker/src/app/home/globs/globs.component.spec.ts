import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobsComponent } from './globs.component';

describe('GlobsComponent', () => {
  let component: GlobsComponent;
  let fixture: ComponentFixture<GlobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
