import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiaohangnhanhComponent } from './giaohangnhanh.component';

describe('GiaohangnhanhComponent', () => {
  let component: GiaohangnhanhComponent;
  let fixture: ComponentFixture<GiaohangnhanhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiaohangnhanhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiaohangnhanhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
