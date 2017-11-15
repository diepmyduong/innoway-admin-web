import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidHistoryComponent } from './paid-history.component';

describe('PaidHistoryComponent', () => {
  let component: PaidHistoryComponent;
  let fixture: ComponentFixture<PaidHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
