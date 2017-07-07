import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCardTypesComponent } from './modal-card-types.component';

describe('ModalCardTypesComponent', () => {
  let component: ModalCardTypesComponent;
  let fixture: ComponentFixture<ModalCardTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCardTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCardTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
