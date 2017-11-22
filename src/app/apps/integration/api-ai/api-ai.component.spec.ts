import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiAiComponent } from './api-ai.component';

describe('ApiAiComponent', () => {
  let component: ApiAiComponent;
  let fixture: ComponentFixture<ApiAiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiAiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
