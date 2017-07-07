import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmenuPortalComponent } from './submenu-portal.component';

describe('SubmenuPortalComponent', () => {
  let component: SubmenuPortalComponent;
  let fixture: ComponentFixture<SubmenuPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmenuPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmenuPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
