import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSponsorComponent } from './event-sponsor.component';

describe('EventSponsorComponent', () => {
  let component: EventSponsorComponent;
  let fixture: ComponentFixture<EventSponsorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventSponsorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventSponsorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
