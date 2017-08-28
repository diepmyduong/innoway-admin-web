import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribersPortalComponent } from './subscribers-portal.component';

describe('SubscribersPortalComponent', () => {
  let component: SubscribersPortalComponent;
  let fixture: ComponentFixture<SubscribersPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribersPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribersPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
