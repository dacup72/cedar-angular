import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SparesDetailsComponent } from './spares-details.component';

describe('SparesDetailsComponent', () => {
  let component: SparesDetailsComponent;
  let fixture: ComponentFixture<SparesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SparesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SparesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
