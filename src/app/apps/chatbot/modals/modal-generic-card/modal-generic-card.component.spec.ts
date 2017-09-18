import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGenericCardComponent } from './modal-generic-card.component';

describe('ModalGenericCardComponent', () => {
  let component: ModalGenericCardComponent;
  let fixture: ComponentFixture<ModalGenericCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGenericCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGenericCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
