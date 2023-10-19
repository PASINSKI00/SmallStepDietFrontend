import { Component, OnInit } from '@angular/core';
import { faAdd, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { DietService } from '../diet.service';
import { FinalDay } from './final-day';
import { SharedService } from 'src/app/shared.service';
import { FinalDiet } from './final-diet';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AlertDetails } from 'src/app/overlays/alert/alert-details';

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
  applicableForResetStates: boolean[] = [];

  constructor(private dietService: DietService, private sharedService: SharedService, private router: Router) { 
  }
  
  ngOnInit() {
    this.getDiet();
  }

  async getDiet(){
    const activeDietId = this.sharedService.getActiveDietId();
    await lastValueFrom(this.dietService.getDiet(activeDietId))
    .then((response) => {
      this.diet = JSON.parse(response.body);
    }).catch(() => {
      const alertDetails = new AlertDetails("Something went wrong");
      this.sharedService.emitChange(alertDetails);
    });
  }

  sumDayPercentage(day: FinalDay) {
    let sum: number = 0;
    day.finalMeals.forEach(meal => {
      sum += meal.percentOfDay!;
    });

    return sum;
  }

  async applyChanges() {
    let isDataValid: boolean = true;
    this.diet.finalDays.forEach(day => {
      if(this.sumDayPercentage(day) != 100) {
        const alertDetails = new AlertDetails("Meal percentages in a day need to sum up to 100%!");
        this.sharedService.emitChange(alertDetails);
        isDataValid = false;
      }
    });

    if(!isDataValid) {
      return;
    }

    const reponse$ = this.dietService.modifyDiet(this.diet);
    const lastValue$ = await lastValueFrom(reponse$);

    if(lastValue$.status != 200) {
      const alertDetails = new AlertDetails("Something went wrong");
      this.sharedService.emitChange(alertDetails);
      return;
    }
    
    this.applicableForResetStates = [];
    this.diet.finalDays.forEach(day => {
      this.applicableForResetStates.push(day.applicableForReset);
    });

    this.getDiet();
  }

  continue(){
    this.router.navigate(['/diet/final/groceries']);
  }

  resetDay(idDay: number) {
    this.dietService.resetDay(this.diet.idDiet, idDay).subscribe(response => {
      this.getDiet();
      this.diet.finalDays.find(day => day.idFinalDay == idDay)!.applicableForReset = false;
      this.applicableForResetStates = [];
      this.diet.finalDays.forEach(day => { this.applicableForResetStates.push(day.applicableForReset); });
    }, (error: any) => {
      const alertDetails = new AlertDetails("Day reset failed. Please try again later.");
      this.sharedService.emitChange(alertDetails);
    });
  }
}
