import { TestBed } from '@angular/core/testing';

import { CatalogStore } from './catalog-store';

describe('CatalogStore', () => {
  let service: CatalogStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatalogStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
