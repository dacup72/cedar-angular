import { TestBed } from '@angular/core/testing';

import { CylindersService } from './cylinders.service';

describe('CylindersService', () => {
  let service: CylindersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CylindersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
