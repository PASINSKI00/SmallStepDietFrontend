import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietViewComponent } from './diet-view.component';

describe('DietViewComponent', () => {
  let component: DietViewComponent;
  let fixture: ComponentFixture<DietViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DietViewComponent]
    });
    fixture = TestBed.createComponent(DietViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
