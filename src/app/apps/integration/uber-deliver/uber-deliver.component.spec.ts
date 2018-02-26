import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UberDeliverComponent } from './uber-deliver.component';

describe('UberDeliverComponent', () => {
  let component: UberDeliverComponent;
  let fixture: ComponentFixture<UberDeliverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UberDeliverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UberDeliverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
