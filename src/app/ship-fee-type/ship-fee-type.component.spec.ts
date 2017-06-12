import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipFeeTypeComponent } from './ship-fee-type.component';

describe('ShipFeeTypeComponent', () => {
  let component: ShipFeeTypeComponent;
  let fixture: ComponentFixture<ShipFeeTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipFeeTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipFeeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
