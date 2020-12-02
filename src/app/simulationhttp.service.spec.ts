import { TestBed } from '@angular/core/testing';

import { SimulationHttpService } from './simulationhttp.service';

describe('SimulationService', () => {
  let service: SimulationHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulationHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
