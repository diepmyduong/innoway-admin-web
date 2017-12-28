import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrateKiotvietLayoutComponent } from './integrate-kiotviet-layout.component';

describe('IntegrateKiotvietLayoutComponent', () => {
  let component: IntegrateKiotvietLayoutComponent;
  let fixture: ComponentFixture<IntegrateKiotvietLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegrateKiotvietLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrateKiotvietLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
