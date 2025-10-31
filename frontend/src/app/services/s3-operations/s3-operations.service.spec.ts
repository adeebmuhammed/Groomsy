import { TestBed } from '@angular/core/testing';

import { S3OperationsService } from './s3-operations.service';

describe('S3OperationsService', () => {
  let service: S3OperationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(S3OperationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
