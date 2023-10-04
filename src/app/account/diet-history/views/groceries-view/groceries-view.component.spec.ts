import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceriesViewComponent } from './groceries-view.component';

describe('GroceriesViewComponent', () => {
  let component: GroceriesViewComponent;
  let fixture: ComponentFixture<GroceriesViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroceriesViewComponent]
    });
    fixture = TestBed.createComponent(GroceriesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
