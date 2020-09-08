import { TestBed } from '@angular/core/testing';

import { QaGasProfileService } from './qa-gas-profile.service';

describe('QaGasProfileService', () => {
  let service: QaGasProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QaGasProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
