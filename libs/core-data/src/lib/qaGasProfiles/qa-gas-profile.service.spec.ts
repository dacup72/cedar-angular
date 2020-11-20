import { TestBed } from '@angular/core/testing';

import { QAGasProfileService } from './qa-gas-profile.service';

describe('QaGasProfileService', () => {
  let service: QAGasProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QAGasProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
