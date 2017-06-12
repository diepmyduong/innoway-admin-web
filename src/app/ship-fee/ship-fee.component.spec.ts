import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipFeeComponent } from './ship-fee.component';

describe('ShipFeeComponent', () => {
  let component: ShipFeeComponent;
  let fixture: ComponentFixture<ShipFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
