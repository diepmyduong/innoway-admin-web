import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBillStatusComponentComponent } from './update-bill-status-component.component';

describe('UpdateBillStatusComponentComponent', () => {
  let component: UpdateBillStatusComponentComponent;
  let fixture: ComponentFixture<UpdateBillStatusComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateBillStatusComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBillStatusComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
