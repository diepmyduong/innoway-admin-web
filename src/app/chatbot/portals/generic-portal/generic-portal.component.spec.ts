import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericPortalComponent } from './generic-portal.component';

describe('GenericPortalComponent', () => {
  let component: GenericPortalComponent;
  let fixture: ComponentFixture<GenericPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
