import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTextCardComponent } from './modal-text-card.component';

describe('ModalTextCardComponent', () => {
  let component: ModalTextCardComponent;
  let fixture: ComponentFixture<ModalTextCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTextCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTextCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
