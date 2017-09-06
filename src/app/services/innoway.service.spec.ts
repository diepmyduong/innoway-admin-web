import { TestBed, inject } from '@angular/core/testing';

import { InnowayService } from './innoway.service';

describe('InnowayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InnowayService]
    });
  });

  it('should ...', inject([InnowayService], (service: InnowayService) => {
    expect(service).toBeTruthy();
  }));
});
