import { Component, OnInit } from '@angular/core';
import { faAdd, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { DietService } from '../diet.service';
import { FinalDay } from './final-day';
import { SharedService } from 'src/app/shared.service';
import { FinalDiet } from './final-diet';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-final-diet',
  templateUrl: './final-diet.component.html',
  styleUrls: ['./final-diet.component.sass']
})
export class FinalDietComponent implements OnInit {
  addIcon = faAdd;
  deleteIcon = faTrashAlt;
  diet: FinalDiet = null!;
  dailyCaloriesIntake: number = 3000;

  constructor(private dietService: DietService, private sharedService: SharedService, private router: Router) { 
  }
  
  ngOnInit() {
    this.getDiet();
  }

  async getDiet(){
    const response$ = this.dietService.getDiet(this.sharedService.getActiveDietId());
    const lastValue$ = await lastValueFrom(response$);

    if(lastValue$.status != 200) {
      alert("Something went wrong");
      return;
    }

    this.diet = JSON.parse(lastValue$.body);

    this.diet.finalDays.forEach(day => {
      day.finalMeals.sort((a, b) => a.idFinalMeal - b.idFinalMeal);
    });
  }

  calculateDayPercentage(day: FinalDay) {
    let sum: number = 0;
    day.finalMeals.forEach(meal => {
      sum += meal.percentOfDay!;
    });

    return sum;
  }

  async applyChanges() {
    this.diet.finalDays.forEach(day => {
      if(this.calculateDayPercentage(day) != 100) {
        alert("Meal percentages in a day need to sum up to 100%!");
        return;
      }
    });

    const reponse$ = this.dietService.modifyDiet(this.diet);
    const lastValue$ = await lastValueFrom(reponse$);

    if(lastValue$.status != 200) {
      alert("Something went wrong");
      return;
    }

    this.getDiet();
  }

  continue(){
    this.router.navigate(['/diet/final/groceries']);
  }
}
