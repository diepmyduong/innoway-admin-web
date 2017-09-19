import { TestBed, inject } from '@angular/core/testing';

import { InnowayServiceService } from './innoway-service.service';

describe('InnowayServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InnowayServiceService]
    });
  });

  it('should ...', inject([InnowayServiceService], (service: InnowayServiceService) => {
    expect(service).toBeTruthy();
  }));
});
