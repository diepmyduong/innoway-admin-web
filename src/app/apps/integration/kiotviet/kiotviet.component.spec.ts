import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KiotvietComponent } from './kiotviet.component';

describe('KiotvietComponent', () => {
  let component: KiotvietComponent;
  let fixture: ComponentFixture<KiotvietComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KiotvietComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KiotvietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
