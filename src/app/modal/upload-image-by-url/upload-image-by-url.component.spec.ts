import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadImageByUrlComponent } from './upload-image-by-url.component';

describe('UploadImageByUrlComponent', () => {
  let component: UploadImageByUrlComponent;
  let fixture: ComponentFixture<UploadImageByUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadImageByUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadImageByUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
