import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionCustomerDetailComponent } from './promotion-customer-detail.component';

describe('PromotionCustomerDetailComponent', () => {
  let component: PromotionCustomerDetailComponent;
  let fixture: ComponentFixture<PromotionCustomerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionCustomerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionCustomerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
