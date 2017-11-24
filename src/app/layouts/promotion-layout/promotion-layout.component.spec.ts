import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionLayoutComponent } from './promotion-layout.component';

describe('PromotionLayoutComponent', () => {
  let component: PromotionLayoutComponent;
  let fixture: ComponentFixture<PromotionLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
