import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandLayoutComponent } from './brand-layout.component';

describe('BrandLayoutComponent', () => {
  let component: BrandLayoutComponent;
  let fixture: ComponentFixture<BrandLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
