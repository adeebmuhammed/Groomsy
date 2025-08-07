import { TestBed } from '@angular/core/testing';

import { BarberUnavailabilityService } from './barber-unavailability.service';

describe('BarberUnavailabilityService', () => {
  let service: BarberUnavailabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarberUnavailabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
