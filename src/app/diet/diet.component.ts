import { Component, OnInit } from '@angular/core';
import { Meal } from './meal';
import { faTrashAlt, faAdd, faAnglesDown, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Category } from './category';
import { Review } from './review';
import { DietService } from './diet.service';
import { SharedService } from '../shared.service';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { BodyInfoService } from '../account/body-info/body-info.service';

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

  filtersVisible: boolean = true;
  sortCriterias: Array<string> = ["Rank", "Protein percent", "Popularity"];
  sortActive: boolean[] = [false, false, false];
  categories: Array<Category> = [];
  categoryActive: Array<boolean> = [];

  singleMealVisible: boolean = false;
  singleMeal: Meal = new Meal(0,'',[],0,'',0,0,0);
  
  isBodyInfoSet: any;

  constructor(private bodyInfoService: BodyInfoService, private dietService: DietService, private sharedService: SharedService, private router: Router) {}

  async ngOnInit() {
    this.getMealsFromBackend();
    this.getCategoriesFromBackend();
    if(!this.sharedService.checkActiveDiet()) {
      this.addDayToDiet();
    } else {
      this.diet = this.sharedService.getActiveDiet();
      this.maxDayIndex = this.diet.length - 1;
    }

    try {
      const response$ = this.bodyInfoService.getBodyInfo();
      const lastValue$ = await lastValueFrom(response$);
      this.isBodyInfoSet = lastValue$.status == 200;
    } catch (error) {}
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

  invertSort(sort: string){
    // sort meals based on avgRating
    if(sort == "Rank") {
      this.sortActive[0] = !this.sortActive[0];
      
      if(this.sortActive[0])
        this.meals.sort((a, b) => {
          if(a.avgRating > b.avgRating) return -1;
          if(a.avgRating < b.avgRating) return 1;
          return 0;
        });
    }

    // sort meals based on proteinRatio
    if(sort == "Protein percent") {
      this.sortActive[1] = !this.sortActive[1];
      
      if(this.sortActive[1])  
        this.meals.sort((a, b) => {
          if(a.proteinRatio > b.proteinRatio) return -1;
          if(a.proteinRatio < b.proteinRatio) return 1;
          return 0;
        });
    }

    // sort meals based on popularity
    if(sort == "Popularity") {
      this.sortActive[2] = !this.sortActive[2];
      
      if(this.sortActive[2])
        this.meals.sort((a, b) => {
          if(a.timesUsed > b.timesUsed) return -1;
          if(a.timesUsed < b.timesUsed) return 1;
          return 0;
        });
    }
  }

  async invertCategory(category: Category, index: number) {
    if(this.categoryActive.includes(true) && !this.categoryActive[index]) {
      alert("You can't filter by more than one category at once");
      return;
    }

    this.categoryActive[index] = !this.categoryActive[index];

    if(this.categoryActive[index]) {
      await this.getMealsFromBackend();

      // get indexes of active categories
      let activeCategories: Array<number> = [];
      for(let i = 0; i < this.categoryActive.length; i++) {
        if(this.categoryActive[i])
          activeCategories.push(i);
      }

      // filter meals based on active categories
      this.meals = this.meals.filter(meal => {
        for(let i = 0; i < activeCategories.length; i++) {
          if(meal.categoriesNames.includes(this.categories[activeCategories[i]].name))
            return true;
        }
        return false;
      });

      console.log(this.meals);

      // sort meals based on active sort criterias
      for(let i = 0; i < this.sortActive.length; i++) {
        if(this.sortActive[i]){
          this.sortActive[i] = !this.sortActive[i];
          this.invertSort(this.sortCriterias[i]);
        }
      }
    } else {
      await this.getMealsFromBackend();
    }
  }

  applySearch(event: any) {
    let search = event.target.value;

    if(search == "") {
      this.getMealsFromBackend();
      // apply sort criterias
      for(let i = 0; i < this.sortActive.length; i++) {
        if(this.sortActive[i]){
          this.sortActive[i] = !this.sortActive[i];
          this.invertSort(this.sortCriterias[i]);
        }
      }

      //apply categories
      for(let i = 0; i < this.categoryActive.length; i++) {
        if(this.categoryActive[i]){
          this.categoryActive[i] = !this.categoryActive[i];
          this.invertCategory(this.categories[i], i);
        }
      }
      return;
    }

  }

  async showSingleMeal(meal: Meal){
    console.log(meal);
    const response$ = this.dietService.extendMeal(meal.idMeal);
    const lastValue$ = await lastValueFrom(response$);

    if(lastValue$.status != 200) 
      return;

    let value = JSON.parse(lastValue$.body);

    meal.extendMeal(value.recipe, value.timeToPrepare, value.proteinRatio, value.carbsRatio, value.fatsRatio, value.reviews);

    this.singleMeal = meal;
    this.singleMealVisible = !this.singleMealVisible;
  }

  async continue() {
    this.sharedService.setActiveDiet(this.diet);

    // Check if diet is empty
    if(this.diet.length == 0) {
      alert("You can't continue with an empty diet");
      return;
    }

    // Check if diet is valid
    for(let i = 0; i < this.diet.length; i++) {
      if(this.diet[i].length == 0) {
        alert("You can't continue with empty days");
        return;
      }
    }

    // Check if logged in and save diet if not
    if(!this.sharedService.isLoggedIn()) {
      alert("You need to be logged in to continue");
      return;
    }

    // Check if user provided bodyinfo
    if(!this.isBodyInfoSet) {
      alert("You need to provide your body information to continue. You will be redirected.");
      this.router.navigate(['/account/bodyinfo']);
      return;
    }

    // Update diet if active diet
    if(this.sharedService.getActiveDietId() != -1) {
      const response$ = this.dietService.updateDiet(this.diet);
      const lastValue$ = await lastValueFrom(response$);

      if(lastValue$.status != 200) {
        alert("Diet wasn't updated. Please try again.");
        return;
      }
    }

    // Create diet if no active diet
    if(this.sharedService.getActiveDietId() == -1) {
      const response$ = this.dietService.uploadDiet(this.diet);
      const lastValue$ = await lastValueFrom(response$);

      if(lastValue$.status != 201) {
        alert("Diet wasn't created. Please try again.");
        return;
      }

      this.sharedService.setActiveDietId(JSON.parse(lastValue$.body));
    }

    this.router.navigate(['/diet/final']);
  }

  private async getMealsFromBackend() : Promise<void> {
    const response$ = this.dietService.getMeals();
    const lastValue$ = await lastValueFrom(response$);

    if(lastValue$.status != 200)
      return;

    let mealsJSON: Array<any> = JSON.parse(lastValue$.body);
    mealsJSON.forEach((mealJSON: any) => {
      this.meals.push(Object.assign(new Meal(mealJSON.id, mealJSON.name, mealJSON.ingredientNames, mealJSON.rating, mealJSON.image, mealJSON.avgRating, mealJSON.proteinRatio, mealJSON.timesUsed), mealJSON));
    });

    // this.dietService.getMeals().subscribe((response) => {
    //   let mealsJSON: Array<any> = JSON.parse(response.body);
    //   mealsJSON.forEach((mealJSON: any) => {
    //     this.meals.push(Object.assign(new Meal(mealJSON.id, mealJSON.name, mealJSON.ingredientNames, mealJSON.rating, mealJSON.image, mealJSON.avgRating, mealJSON.proteinRatio, mealJSON.timesUsed), mealJSON));
    //   });
    // });
  }

  private getCategoriesFromBackend() {
    this.dietService.getCategories().subscribe((response) => {
      let categoriesJSON: Array<any> = JSON.parse(response.body);
      categoriesJSON.forEach((categoryJSON: any) => {
        this.categories.push(Object.assign(new Category(categoryJSON.id, categoryJSON.name), categoryJSON));
        this.categoryActive.push(false);
      });
    });
  }
}
