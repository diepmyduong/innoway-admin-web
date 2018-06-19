import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HaravanComponent } from './haravan.component';

describe('HaravanComponent', () => {
  let component: HaravanComponent;
  let fixture: ComponentFixture<HaravanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HaravanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HaravanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
