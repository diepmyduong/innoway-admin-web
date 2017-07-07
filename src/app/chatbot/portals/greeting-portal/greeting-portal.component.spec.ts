import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GreetingPortalComponent } from './greeting-portal.component';

describe('GreetingPortalComponent', () => {
  let component: GreetingPortalComponent;
  let fixture: ComponentFixture<GreetingPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GreetingPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GreetingPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
