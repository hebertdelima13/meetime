import { TestBed } from '@angular/core/testing';

import { EventsStoreService } from './events-store.service';

describe('EventsStoreService', () => {
  let service: EventsStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventsStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
