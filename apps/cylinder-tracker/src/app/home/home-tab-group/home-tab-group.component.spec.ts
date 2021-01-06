import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTabGroupComponent } from './home-tab-group.component';

describe('HomeTabGroupComponent', () => {
  let component: HomeTabGroupComponent;
  let fixture: ComponentFixture<HomeTabGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeTabGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeTabGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
