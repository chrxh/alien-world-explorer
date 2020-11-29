import { TestBed } from '@angular/core/testing';

import { SimulationDataService } from './simulationdata.service';

describe('SimulationdataService', () => {
  let service: SimulationDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulationDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
