import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoriesPortalComponent } from './stories-portal.component';

describe('StoriesPortalComponent', () => {
  let component: StoriesPortalComponent;
  let fixture: ComponentFixture<StoriesPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoriesPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoriesPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
