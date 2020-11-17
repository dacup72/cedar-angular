import { async, TestBed } from '@angular/core/testing';
import { SelectAutocompleteModule } from './select-autocomplete.module';

describe('SelectAutocompleteModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SelectAutocompleteModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SelectAutocompleteModule).toBeDefined();
  });
});
