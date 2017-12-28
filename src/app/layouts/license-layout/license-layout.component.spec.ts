import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseLayoutComponent } from './license-layout.component';

describe('LicenseLayoutComponent', () => {
  let component: LicenseLayoutComponent;
  let fixture: ComponentFixture<LicenseLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenseLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
