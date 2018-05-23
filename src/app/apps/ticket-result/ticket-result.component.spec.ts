import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketResultComponent } from './ticket-result.component';

describe('TicketResultComponent', () => {
  let component: TicketResultComponent;
  let fixture: ComponentFixture<TicketResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
