import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { barberAlreadyLoggedInGuard } from './barber-already-logged-in.guard';

describe('barberAlreadyLoggedInGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => barberAlreadyLoggedInGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
