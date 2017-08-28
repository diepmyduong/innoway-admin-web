import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePortalComponent } from './schedule-portal.component';

describe('SchedulePortalComponent', () => {
  let component: SchedulePortalComponent;
  let fixture: ComponentFixture<SchedulePortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulePortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulePortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
