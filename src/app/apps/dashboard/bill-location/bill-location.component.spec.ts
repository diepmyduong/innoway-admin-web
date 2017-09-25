import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillLocationComponent } from './bill-location.component';

describe('BillLocationComponent', () => {
  let component: BillLocationComponent;
  let fixture: ComponentFixture<BillLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
