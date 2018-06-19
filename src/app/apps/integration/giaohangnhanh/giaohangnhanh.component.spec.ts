import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiaoHangNhanhComponent } from './giaohangnhanh.component';

describe('GiaoHangNhanhComponent', () => {
  let component: GiaoHangNhanhComponent;
  let fixture: ComponentFixture<GiaoHangNhanhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiaoHangNhanhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiaoHangNhanhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
