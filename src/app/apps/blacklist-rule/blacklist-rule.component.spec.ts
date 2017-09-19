import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlacklistRuleComponent } from './blacklist-rule.component';

describe('BlacklistRuleComponent', () => {
  let component: BlacklistRuleComponent;
  let fixture: ComponentFixture<BlacklistRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlacklistRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlacklistRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
