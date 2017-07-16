import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalQuickRepliesItemComponent } from './modal-quick-replies-item.component';

describe('ModalQuickRepliesItemComponent', () => {
  let component: ModalQuickRepliesItemComponent;
  let fixture: ComponentFixture<ModalQuickRepliesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalQuickRepliesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalQuickRepliesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
