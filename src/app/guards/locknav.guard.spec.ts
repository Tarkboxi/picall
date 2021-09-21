import { TestBed } from '@angular/core/testing';

import { LocknavGuard } from './locknav.guard';

describe('LocknavGuard', () => {
  let guard: LocknavGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LocknavGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
