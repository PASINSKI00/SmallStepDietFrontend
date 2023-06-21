import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietHistoryComponent } from './diet-history.component';

describe('DietHistoryComponent', () => {
  let component: DietHistoryComponent;
  let fixture: ComponentFixture<DietHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DietHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DietHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
