import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandTypeComponent } from './brand-type.component';

describe('BrandTypeComponent', () => {
  let component: BrandTypeComponent;
  let fixture: ComponentFixture<BrandTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
