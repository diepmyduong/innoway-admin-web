import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCommentComponent } from './ticket-comment.component';

describe('TicketCommentComponent', () => {
  let component: TicketCommentComponent;
  let fixture: ComponentFixture<TicketCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
