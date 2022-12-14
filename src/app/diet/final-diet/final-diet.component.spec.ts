import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalDietComponent } from './final-diet.component';

describe('FinalDietComponent', () => {
  let component: FinalDietComponent;
  let fixture: ComponentFixture<FinalDietComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalDietComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalDietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
