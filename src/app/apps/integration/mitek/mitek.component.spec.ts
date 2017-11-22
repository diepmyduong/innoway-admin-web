import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MitekComponent } from './mitek.component';

describe('MitekComponent', () => {
  let component: MitekComponent;
  let fixture: ComponentFixture<MitekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MitekComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MitekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
