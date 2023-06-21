import { TestBed } from '@angular/core/testing';

import { BodyInfoService } from './body-info.service';

describe('BodyInfoService', () => {
  let service: BodyInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BodyInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
