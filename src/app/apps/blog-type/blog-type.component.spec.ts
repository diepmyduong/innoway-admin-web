import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogTypeComponent } from './blog-type.component';

describe('BlogTypeComponent', () => {
  let component: BlogTypeComponent;
  let fixture: ComponentFixture<BlogTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
