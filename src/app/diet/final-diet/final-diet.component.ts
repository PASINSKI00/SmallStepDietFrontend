import { Component, OnInit } from '@angular/core';
import { faAdd, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { DietService } from '../diet.service';
import { Ingredient } from '../ingredient';
import { Meal } from '../meal';
import { FinalMeal } from './final-meal';

@Component({
  selector: 'app-final-diet',
  templateUrl: './final-diet.component.html',
  styleUrls: ['./final-diet.component.sass']
})
export class FinalDietComponent implements OnInit {
  addIcon = faAdd;
  deleteIcon = faTrashAlt;
  diet: Array<Array<FinalMeal>> = [];

  constructor(private dietService: DietService) { }

  ngOnInit(): void {
    let simpleDiet = this.dietService.getDiet();
    this.diet = this.convertToFinalDiet(simpleDiet);
    console.log(this.diet);
  }

  convertToFinalDiet(simpleDiet: Meal[][]): FinalMeal[][] {
    let finalDiet: FinalMeal[][] = [];
    simpleDiet.forEach(day => {
      let finalDay: FinalMeal[] = [];
      day.forEach(meal => {
        let ingredients: Array<Ingredient> = [];
        this.dietService.getIngredientsByNames(meal.ingredientsNames).subscribe(response => {
          ingredients = response.body;
        });
        let finalMeal: FinalMeal = new FinalMeal(meal.idMeal, meal.name,ingredients);
        finalDay.push(finalMeal);
      });
      finalDiet.push(finalDay);
    });  

    this.setIngredientsWeights(finalDiet);

    return finalDiet;
  }

  setIngredientsWeights(finalDiet: FinalMeal[][]) {
    finalDiet.forEach(day => {
      day.forEach(meal => {
        meal.ingredients.forEach(ingredient => {
          ingredient.weight = this.calculateIngredientWeight(ingredient, meal);
        });
      });
    });
  }

  calculateIngredientWeight(ingredient: Ingredient, meal: FinalMeal): number {
    let weight: number = 0;
    
    return weight;
  }

  calculateDayPercent(dayIndex: number): number {
    let percent: number = 0;
    //TODO
    return percent;
  }

  calculateDayKcal(dayIndex: number): number {
    let kcal: number = 0;
    //TODO
    return kcal;
  }

  calculateDayProtein(dayIndex: number): number {
    let protein: number = 0;
    //TODO
    return protein;
  }

  calculateDayCarbs(dayIndex: number): number {
    let carbs: number = 0;
    //TODO
    return carbs;
  }

  calculateDayFats(dayIndex: number): number {
    let fat: number = 0;
    //TODO
    return fat;
  }

  getPercentOfMealInADay(dayIndex: number, mealIndex: number) {
    let percent: number = 0;
    //TODO
    return percent;
  }
}
