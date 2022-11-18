import { Component, OnInit } from '@angular/core';
import { Meal } from './meal';
import { faTrashAlt, faAdd, faAnglesDown } from '@fortawesome/free-solid-svg-icons';
import { Category } from './category';

@Component({
  selector: 'app-diet',
  templateUrl: './diet.component.html',
  styleUrls: ['./diet.component.sass']
})
export class DietComponent implements OnInit {
  deleteIcon = faTrashAlt;
  addIcon = faAdd;
  filterIcon = faAnglesDown;
  meals: Array<Meal> = [];
  diet: Array<Array<Meal>> = [];
  chosenDayIndex: number = 0;
  maxDayIndex: number = -1;
  sortCriterias: Array<string> = ["ranking", "protein%", "popularity"];
  categories: Array<Category> = [];
  filtersVisible: boolean = false;

  constructor() {
    this.meals.push(new Meal(1, "White rice with vegetables and some other stuff", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    this.meals.push(new Meal(1, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    this.meals.push(new Meal(1, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    this.meals.push(new Meal(1, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    this.meals.push(new Meal(1, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    this.meals.push(new Meal(1, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    this.meals.push(new Meal(1, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    this.meals.push(new Meal(1, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    this.meals.push(new Meal(1, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    this.meals.push(new Meal(1, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    this.meals.push(new Meal(1, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    this.meals.push(new Meal(1, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));

    this.categories.push(new Category(1, "Breakfast"));
    this.categories.push(new Category(2, "Lunch"));
    this.categories.push(new Category(3, "Dinner"));
    this.categories.push(new Category(4, "Snack"));
    this.categories.push(new Category(4, "Snack"));
    this.categories.push(new Category(4, "Snack"));
    this.categories.push(new Category(4, "Snack"));
    this.categories.push(new Category(4, "Snack"));
    this.categories.push(new Category(4, "Snack"));
    this.categories.push(new Category(4, "Snack"));
    this.categories.push(new Category(4, "Snack"));
    this.categories.push(new Category(4, "Snack"));
    this.categories.push(new Category(4, "Snack"));
    this.categories.push(new Category(4, "Snack"));
    this.categories.push(new Category(4, "Snack"));
    this.categories.push(new Category(4, "Snack"));
    this.categories.push(new Category(4, "Snack"));
    this.categories.push(new Category(4, "Snack"));
    this.categories.push(new Category(4, "Snack"));
    this.categories.push(new Category(4, "Snack"));
    this.categories.push(new Category(4, "Snack"));
    this.categories.push(new Category(4, "Snack"));



    this.addDayToDiet();
    this.addMealToDiet(this.meals[0]);
    this.addMealToDiet(this.meals[1]);
   }

  ngOnInit(): void {
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

  continue() {
    console.log(this.diet);
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
}
