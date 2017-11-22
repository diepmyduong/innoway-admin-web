import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AhamoveComponent } from './ahamove.component';

describe('AhamoveComponent', () => {
  let component: AhamoveComponent;
  let fixture: ComponentFixture<AhamoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AhamoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AhamoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
