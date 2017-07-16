import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalButtonTypesComponent } from './modal-button-types.component';

describe('ModalButtonTypesComponent', () => {
  let component: ModalButtonTypesComponent;
  let fixture: ComponentFixture<ModalButtonTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalButtonTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalButtonTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
