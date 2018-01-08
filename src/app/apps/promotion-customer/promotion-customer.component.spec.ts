import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionCustomerComponent } from './promotion-customer.component';

describe('PromotionCustomerComponent', () => {
  let component: PromotionCustomerComponent;
  let fixture: ComponentFixture<PromotionCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
