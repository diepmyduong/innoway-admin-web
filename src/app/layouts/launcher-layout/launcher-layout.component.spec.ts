import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LauncherLayoutComponent } from './launcher-layout.component';

describe('LauncherLayoutComponent', () => {
  let component: LauncherLayoutComponent;
  let fixture: ComponentFixture<LauncherLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LauncherLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LauncherLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
