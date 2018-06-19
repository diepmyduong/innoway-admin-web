import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GhtkComponent } from './ghtk.component';

describe('GhtkComponent', () => {
  let component: GhtkComponent;
  let fixture: ComponentFixture<GhtkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GhtkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GhtkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
