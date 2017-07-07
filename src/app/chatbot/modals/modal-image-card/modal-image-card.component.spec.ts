import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImageCardComponent } from './modal-image-card.component';

describe('ModalImageCardComponent', () => {
  let component: ModalImageCardComponent;
  let fixture: ComponentFixture<ModalImageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalImageCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalImageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
