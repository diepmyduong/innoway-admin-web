import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTypeComponent } from './notification-type.component';

describe('NotificationTypeComponent', () => {
  let component: NotificationTypeComponent;
  let fixture: ComponentFixture<NotificationTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
