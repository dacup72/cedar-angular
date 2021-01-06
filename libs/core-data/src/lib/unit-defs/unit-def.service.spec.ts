import { TestBed } from '@angular/core/testing';

import { UnitDefService } from './unit-def.service';

describe('UnitDefProfileService', () => {
  let service: UnitDefService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitDefService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
