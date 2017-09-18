import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchTypeComponent } from './branch-type.component';

describe('BranchTypeComponent', () => {
  let component: BranchTypeComponent;
  let fixture: ComponentFixture<BranchTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
