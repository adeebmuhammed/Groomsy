import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { userAlreadyLoggedInGuard } from './user-already-logged-in.guard';

describe('userAlreadyLoggedInGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => userAlreadyLoggedInGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
