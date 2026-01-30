import { TestBed } from '@angular/core/testing';

import { MyStripeService } from './my-stripe-service';

describe('MyStripeService', () => {
  let service: MyStripeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyStripeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
