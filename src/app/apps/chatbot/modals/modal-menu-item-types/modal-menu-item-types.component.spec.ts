import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMenuItemTypesComponent } from './modal-menu-item-types.component';

describe('ModalMenuItemTypesComponent', () => {
  let component: ModalMenuItemTypesComponent;
  let fixture: ComponentFixture<ModalMenuItemTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMenuItemTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMenuItemTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
