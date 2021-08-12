import { TestBed } from '@angular/core/testing';

import { AutGuard } from './aut.guard';

describe('AutGuard', () => {
  let guard: AutGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AutGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
