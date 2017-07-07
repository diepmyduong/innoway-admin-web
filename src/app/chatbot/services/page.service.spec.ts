import { TestBed, inject } from '@angular/core/testing';

import { PageService } from './page.service';

describe('PageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageService]
    });
  });

  it('should ...', inject([PageService], (service: PageService) => {
    expect(service).toBeTruthy();
  }));
});
