import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SparesListComponent } from './spares-list.component';

describe('SparesListComponent', () => {
  let component: SparesListComponent;
  let fixture: ComponentFixture<SparesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SparesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SparesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
