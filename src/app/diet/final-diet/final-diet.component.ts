import { Component, OnInit } from '@angular/core';
import { faAdd, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { DietService } from '../diet.service';
import { Ingredient } from '../ingredient';
import { Meal } from '../meal';
import { FinalMeal } from './final-meal';
import { FinalDay } from './final-day';
import { SharedService } from 'src/app/shared.service';
import { FinalDiet } from './final-diet';

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

  constructor(private dietService: DietService, sharedService: SharedService) { 
    this.dietService.getDiet(sharedService.activeDietId).subscribe((response) => {
      if(response.status != 200) {
        alert("Something went wrong");
        return;
      }

      console.log(response.body);

      this.diet = JSON.parse(response.body);
      console.log(this.diet);
    });
  }
  
  ngOnInit() {
  }

  calculateDayPercentage(day: FinalDay) {
    let sum: number = 0;
    day.finalMeals.forEach(meal => {
      sum += meal.percentOfDay;
    });

    return sum;
  }
}
