import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackRuleComponent } from './feedback-rule.component';

describe('FeedbackRuleComponent', () => {
  let component: FeedbackRuleComponent;
  let fixture: ComponentFixture<FeedbackRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
