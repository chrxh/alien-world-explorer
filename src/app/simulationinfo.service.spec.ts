import { TestBed } from '@angular/core/testing';

import { SimulationInfoService } from './simulation-info.service';

describe('SimulationInfoService', () => {
  let service: SimulationInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulationInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
