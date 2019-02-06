import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateByCourseComponent } from './rate-by-course.component';

describe('RateByCourseComponent', () => {
  let component: RateByCourseComponent;
  let fixture: ComponentFixture<RateByCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateByCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateByCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
