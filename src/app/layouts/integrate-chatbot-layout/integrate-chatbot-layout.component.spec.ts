import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrateChatbotLayoutComponent } from './integrate-chatbot-layout.component';

describe('IntegrateChatbotLayoutComponent', () => {
  let component: IntegrateChatbotLayoutComponent;
  let fixture: ComponentFixture<IntegrateChatbotLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegrateChatbotLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrateChatbotLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
