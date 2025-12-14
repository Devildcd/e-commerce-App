import { TestBed } from '@angular/core/testing';

import { CartPersistenceService } from './cart-persistence-service';

describe('CartPersistenceService', () => {
  let service: CartPersistenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartPersistenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
