import { async, TestBed } from '@angular/core/testing';
import { DatePickerModule } from './date-picker.module';

describe('DatePickerModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DatePickerModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(DatePickerModule).toBeDefined();
  });
});
