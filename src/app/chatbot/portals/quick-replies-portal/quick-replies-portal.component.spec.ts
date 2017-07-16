import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickRepliesPortalComponent } from './quick-replies-portal.component';

describe('QuickRepliesPortalComponent', () => {
  let component: QuickRepliesPortalComponent;
  let fixture: ComponentFixture<QuickRepliesPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickRepliesPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickRepliesPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
