import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryPortalComponent } from './story-portal.component';

describe('StoryPortalComponent', () => {
  let component: StoryPortalComponent;
  let fixture: ComponentFixture<StoryPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
