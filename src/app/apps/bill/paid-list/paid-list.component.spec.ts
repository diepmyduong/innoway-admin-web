import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidListComponent } from './paid-list.component';

describe('PaidListComponent', () => {
  let component: PaidListComponent;
  let fixture: ComponentFixture<PaidListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
