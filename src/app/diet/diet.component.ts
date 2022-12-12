import { Component, OnInit } from '@angular/core';
import { Meal } from './meal';
import { faTrashAlt, faAdd, faAnglesDown, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Category } from './category';
import { Review } from './review';
import { DietService } from './diet.service';
import { SharedService } from '../shared.service';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-diet',
  templateUrl: './diet.component.html',
  styleUrls: ['./diet.component.sass']
})
export class DietComponent implements OnInit {
  deleteIcon = faTrashAlt;
  addIcon = faAdd;
  filterIcon = faAnglesDown;
  returnIcon = faAngleLeft;

  meals: Array<Meal> = [];
  diet: Array<Array<Meal>> = [];
  chosenDayIndex: number = 0;
  maxDayIndex: number = -1;
  sortCriterias: Array<string> = ["ranking", "protein%", "popularity"];
  categories: Array<Category> = [];
  filtersVisible: boolean = false;

  singleMealVisible: boolean = false;
  singleMeal: Meal|undefined = undefined;

  constructor(private dietService: DietService, private sharedService: SharedService, private router: Router) {}

  async ngOnInit() {
    this.addDayToDiet();
    this.getMealsFromBackend();
    this.getCategoriesFromBackend();
  }

  addDayToDiet() {
    if(this.maxDayIndex == 6) {
      alert("You can't add more than 7 days to a diet");
      return;
    }
    
    this.maxDayIndex++;
    this.chosenDayIndex = this.maxDayIndex;
    this.diet.push(new Array<Meal>());
  }

  addMealToDiet(meal: Meal) {
    if(this.diet[this.chosenDayIndex].length == 8) {
      alert("You can't add more than 8 meals to one day");
      return;
    }

    this.diet[this.chosenDayIndex].push(meal);
  }

  removeMealFromDiet(meal: Meal) {
    this.diet[this.chosenDayIndex].splice(this.diet[this.chosenDayIndex].indexOf(meal), 1);
  }

  chosenMealBackground(image: string) {
    return {
      'background-image': 'url(' + image + ')',
      'background-size': 'cover',
      'background-position': 'center'
    }
  }

  removeDayFromDiet() {
    this.diet.splice(this.chosenDayIndex, 1);
    this.maxDayIndex--;
    this.changeDay(this.maxDayIndex);
  }

  changeDay(dayIndex: number) {
    this.chosenDayIndex = dayIndex;
  }

  showFilters() {
    this.filtersVisible = !this.filtersVisible;
  }

  showSingleMeal(meal: Meal){
    console.log(meal);
    this.singleMealVisible = !this.singleMealVisible;
    this.singleMeal = meal;
  }

  async continue() {
    const response$ = this.dietService.uploadDiet(this.diet);
    const lastValue$ = await lastValueFrom(response$);

    if(lastValue$.status != 201) {
      alert("Diet wasn't uploaded. Please try again.");
      return;
    }

    this.sharedService.activeDietId = JSON.parse(lastValue$.body);

    this.router.navigate(['/diet/final']);
  }

  private getMealsFromBackend() {
    this.dietService.getMeals().subscribe((response) => {
      let mealsJSON: Array<any> = JSON.parse(response.body);
      mealsJSON.forEach((mealJSON: any) => {
        this.meals.push(Object.assign(new Meal(mealJSON.id, mealJSON.name, mealJSON.ingredientNames, mealJSON.rating, mealJSON.image), mealJSON));
      });

      this.addMealToDiet(this.meals[0]);
  
      this.meals[0].extendMeal("This is a recipe sadsdsad asdasdsad sad sadsadsa asdsadsad saddsadsad sad sad sa da dad as dsa da d a adsada \n dsdsadsad sad sad sa da dad as dsa da d a adsada \n dsdsadsad sad sad sa da dad as dsa da d a adsada \n dsdsadsad sad sad sa da dad as dsa da d a adsada \n dsdsadsad sad sad sa da dad as dsa da d a adsada \n dsdsadsad sad sad sa da dad as dsa da d a adsada \n ds sad sa da dad as dsa da d a adsada \n dsfadsadsa \n dsadsadsads \nfor meal dsadsad sad sad sa da dad as dsa da d a adsada \n ds dsadsad sad sad sa da dad as dsa da d a adsada \n ds 0", 20, 20, 20, 60, new Array<Review>());
      this.singleMeal = this.meals[0];
      this.singleMeal.reviews.push(new Review("/assets/images/Hot_meal_header.png", "Charlie", 7, "Good meal"));
      this.singleMeal.reviews.push(new Review("/assets/images/Hot_meal_header.png", "Katy", 6));
    });
  }

  private getCategoriesFromBackend() {
    this.dietService.getCategories().subscribe((response) => {
      let categoriesJSON: Array<any> = JSON.parse(response.body);
      categoriesJSON.forEach((categoryJSON: any) => {
        this.categories.push(Object.assign(new Category(categoryJSON.id, categoryJSON.name), categoryJSON));
      });
    });
  }
}
