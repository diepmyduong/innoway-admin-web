import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryLayoutComponent } from './summary-layout.component';

describe('SummaryLayoutComponent', () => {
  let component: SummaryLayoutComponent;
  let fixture: ComponentFixture<SummaryLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
