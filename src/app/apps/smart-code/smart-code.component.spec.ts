import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartCodeComponent } from './smart-code.component';

describe('SmartCodeComponent', () => {
  let component: SmartCodeComponent;
  let fixture: ComponentFixture<SmartCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
