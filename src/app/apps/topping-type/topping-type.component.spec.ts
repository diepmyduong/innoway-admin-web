import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToppingTypeComponent } from './topping-type.component';

describe('ToppingTypeComponent', () => {
  let component: ToppingTypeComponent;
  let fixture: ComponentFixture<ToppingTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToppingTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToppingTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
