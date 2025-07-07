import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminAlreadyLoggedInGuard } from './admin-already-logged-in.guard';

describe('adminAlreadyLoggedInGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminAlreadyLoggedInGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
