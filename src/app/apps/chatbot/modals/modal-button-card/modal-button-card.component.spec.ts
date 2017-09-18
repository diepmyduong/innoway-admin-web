import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalButtonCardComponent } from './modal-button-card.component';

describe('ModalButtonCardComponent', () => {
  let component: ModalButtonCardComponent;
  let fixture: ComponentFixture<ModalButtonCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalButtonCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalButtonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
