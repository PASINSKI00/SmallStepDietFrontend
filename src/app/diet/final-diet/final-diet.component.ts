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

  isDownloading: boolean = false;
  isResetting: boolean[] = [];

  constructor(private dietService: DietService, private sharedService: SharedService, private router: Router) { 
  }
  
  ngOnInit() {
    this.getDiet();
  }

  async getDiet(){
    this.isDownloading = true;
    const activeDietId = this.sharedService.getActiveDietId();
    await lastValueFrom(this.dietService.getDiet(activeDietId))
    .then((response) => {
      this.diet = JSON.parse(response.body);
      this.isResetting = [];
      this.diet.finalDays.forEach(day => {
        this.isResetting.push(false);
      });
    }).catch(() => {
      const alertDetails = new AlertDetails("Something went wrong");
      this.sharedService.emitChange(alertDetails);
    });
    this.isDownloading = false;
  }

  sumDayPercentage(day: FinalDay) {
    let sum: number = 0;
    day.finalMeals.forEach(meal => {
      sum += meal.percentOfDay!;
    });

    return sum;
  }

  async applyChanges() {
    this.isDownloading = true;
    let isDataValid: boolean = true;
    this.diet.finalDays.forEach(day => {
      if(this.sumDayPercentage(day) != 100) {
        const alertDetails = new AlertDetails("Meal percentages in a day need to sum up to 100%!");
        this.sharedService.emitChange(alertDetails);
        isDataValid = false;
      }
    });

    if(!isDataValid) {
      this.isDownloading = false;
      return;
    }

    await lastValueFrom(this.dietService.modifyDiet(this.diet)).then(() => {
      this.applicableForResetStates = [];
      this.diet.finalDays.forEach(day => {
        this.applicableForResetStates.push(day.applicableForReset);
      });
      this.getDiet();
    }).catch(() => {
      const alertDetails = new AlertDetails("Something went wrong");
      this.sharedService.emitChange(alertDetails);
    });

    this.isDownloading = false;
  }

  async resetDay(idDay: number, dayIndex: number) {
    this.isResetting[dayIndex] = true;
    await lastValueFrom(this.dietService.resetDay(this.diet.idDiet, idDay)).then(() => {
      this.getDiet();
      this.diet.finalDays.find(day => day.idFinalDay == idDay)!.applicableForReset = false;
      this.applicableForResetStates = [];
      this.diet.finalDays.forEach(day => { this.applicableForResetStates.push(day.applicableForReset); });
    }).catch(() => {
      const alertDetails = new AlertDetails("Day reset failed. Please try again.");
      this.sharedService.emitChange(alertDetails);
    });
  }

  isDayLoading(dayIndex: number){
    return this.isDownloading || this.isResetting[dayIndex];
  }
}
