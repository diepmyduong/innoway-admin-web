import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetStartedPortalComponent } from './get-started-portal.component';

describe('GetStartedPortalComponent', () => {
  let component: GetStartedPortalComponent;
  let fixture: ComponentFixture<GetStartedPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetStartedPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetStartedPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
