import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSendStoryComponent } from './modal-send-story.component';

describe('ModalSendStoryComponent', () => {
  let component: ModalSendStoryComponent;
  let fixture: ComponentFixture<ModalSendStoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSendStoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSendStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
