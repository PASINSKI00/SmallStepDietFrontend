import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Meal } from './meal';
import { faTrashAlt, faAdd, faAnglesDown, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Category } from './category';
import { DietService } from './diet.service';
import { SharedService } from '../shared.service';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { BodyInfoService } from '../account/body-info/body-info.service';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { RedirectDetails } from '../overlays/redirect/redirect-details';
import { AlertDetails } from '../overlays/alert/alert-details';

@Component({
  selector: 'app-diet',
  templateUrl: './diet.component.html',
  styleUrls: ['./diet.component.sass']
})
export class DietComponent implements OnInit {
  @ViewChild('infinityScrollStart', { static: true }) infinityScrollStart!: ElementRef;
  @ViewChild('infinityScrollEnd', { static: true }) infinityScrollEnd!: ElementRef;

  observerStart!: IntersectionObserver;
  observerEnd!: IntersectionObserver;
  
  deleteIcon = faTrashAlt;
  addIcon = faAdd;
  filterIcon = faAnglesDown;
  returnIcon = faAngleLeft;

  meals: Array<Meal> = [];

  diet: Array<Array<Meal>> = [];
  chosenDayIndex: number = 0;
  maxDayIndex: number = -1;

  filtersVisible: boolean = false;
  sortCriterias: Array<string> = ["Ranking", "Protein percent", "Popularity"];
  sortActive: boolean[] = [false, false, false];
  categories: Array<Category> = [];
  categoryActive: Array<boolean> = [];

  singleMealVisible: boolean = false;
  singleMeal: Meal = new Meal(0,'',[],0,'',0,0,0);
  
  isBodyInfoSet: any;
  formUpdated: boolean = false;

  firstPageNumber: number = 0;
  lastPageNumber: number = 2;
  pageSize: number = 15;

  mealQueryInput = this.formBuilder.group({
    nameContains: '',
    sortBy: '',
    categories: this.formBuilder.array([]),
  });

  constructor(
    private bodyInfoService: BodyInfoService, 
    private dietService: DietService, 
    private sharedService: SharedService, 
    private router: Router, 
    private formBuilder: FormBuilder) {}

  async ngOnInit() {
    this.getInitialMealsFromBackend();
    this.getCategoriesFromBackend();
    if(this.sharedService.checkActiveDiet()) {
      this.diet = this.sharedService.getActiveDiet();
      this.maxDayIndex = this.diet.length - 1;
    } else {
      this.addDayToDiet();
    }

    lastValueFrom(this.bodyInfoService.getBodyInfo())
    .then(() => {
      this.isBodyInfoSet = true;
    }).catch(() => {
      this.isBodyInfoSet = false;
    });

    this.mealQueryInput.valueChanges.subscribe(() => {
      this.formUpdated = true;
    });
  }

  ngAfterViewInit() {
    this.initIntersectionObservers();
  }

  initIntersectionObservers() {
    const options = {
      root: null,
      threshold: 0.01
    };

    this.observerStart = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.appendMealsAtTheStart();
        }
      });
    }, options);

    this.observerEnd = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.appendMealsAtTheBack();
        }  
      });
    }, options);

    this.observerStart.observe(this.infinityScrollStart.nativeElement);
    this.observerEnd.observe(this.infinityScrollEnd.nativeElement);
  }

  appendMealsAtTheStart() {
    if(this.firstPageNumber == 0)
      return;

    lastValueFrom(this.dietService.getMealsAsArray(this.mealQueryInput, this.firstPageNumber-1, this.pageSize)).then((array) => {
      if(array.length == 0){
        return;
      }
      this.meals.unshift(...array);
      this.meals.splice(this.meals.length - array.length, array.length);
      this.firstPageNumber--;
      this.lastPageNumber--;
    }).catch(() => {
      const alertDetails = new AlertDetails("Couldn't load meals. Please refresh the page to try again.")
      this.sharedService.emitChange(alertDetails);
    });
  }

  appendMealsAtTheBack() {
    lastValueFrom(this.dietService.getMealsAsArray(this.mealQueryInput, this.lastPageNumber+1, this.pageSize)).then((array) => {
      if(array.length == 0)
        return;

      this.meals.push(...array);
      this.meals.splice(0, array.length);
      this.firstPageNumber++;
      this.lastPageNumber++;
    }).catch(() => {
      const alertDetails = new AlertDetails("Couldn't load meals. Please refresh the page to try again.")
      this.sharedService.emitChange(alertDetails);
    });
  }

  addDayToDiet() {
    if(this.maxDayIndex == 6) {
      return;
    }
    
    this.maxDayIndex++;
    this.chosenDayIndex = this.maxDayIndex;
    this.diet.push(new Array<Meal>());
  }

  addMealToDiet(meal: Meal) {
    if(this.diet[this.chosenDayIndex].length == 8) {
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

  removeDayFromDiet(i?: number) {
    if(i == undefined) {
      i = this.chosenDayIndex;
    }

    this.diet.splice(i, 1);
    this.maxDayIndex--;
    this.chosenDayIndex = this.maxDayIndex;
  }

  toggleSortValue(sort: string) {
    const newValue = this.mealQueryInput.get('sortBy')?.value === sort ? '' : sort;
    this.mealQueryInput.get('sortBy')?.setValue(newValue);
  }

  appendCategoryToQuery(name: string) {
    const categoriesArray = this.mealQueryInput.get('categories') as FormArray;
    const existingCategoryIndex = categoriesArray.value.indexOf(name);

    if (existingCategoryIndex !== -1) {
      categoriesArray.removeAt(existingCategoryIndex);
    } else {
      categoriesArray.push(new FormControl(name));
    }
  }

  searchClicked(){
    this.getInitialMealsFromBackend();
    this.formUpdated = false;
  }

  async showSingleMeal(meal: Meal){
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

    // Check if diet is valid
    for(let i = this.diet.length-1 ; i >= 0 ; i--) {
      if(this.diet[i].length == 0) {
        this.removeDayFromDiet(i);
      }
    }

    // Check if diet is empty
    if(this.diet.length == 0) {
      const alertDetails = new AlertDetails("Diet is empty. Please add meals.");
      this.sharedService.emitChange(alertDetails);
      this.addDayToDiet();
      return;
    }

    // Check if logged in and save diet if not
    if(!this.sharedService.isLoggedIn()) {
      const redirectDetails = new RedirectDetails("You need to be logged in to continue", "login");
      this.sharedService.emitChange(redirectDetails);
      return;
    }

    // Check if user provided bodyinfo
    if(!this.isBodyInfoSet) {
      const redirectDetails = new RedirectDetails("Body information missing", "/account/bodyinfo");
      this.sharedService.emitChange(redirectDetails);
      return;
    }

    // Update diet if active diet
    if(this.sharedService.getActiveDietId() != -1) {
      await lastValueFrom(this.dietService.updateDiet(this.diet))
        .catch(() => {
          const alertDetails = new AlertDetails("Diet wasn't updated. Please try again.");
          this.sharedService.emitChange(alertDetails);
          return;
        });
    }

    // Create diet if no active diet
    if(this.sharedService.getActiveDietId() == -1) {
      await lastValueFrom(this.dietService.uploadDiet(this.diet)).then((response) => {
        this.sharedService.setActiveDietId(JSON.parse(response.body));
      }).catch(() => {
        const alertDetails = new AlertDetails("Diet wasn't created. Please try again.");
        this.sharedService.emitChange(alertDetails);
        return;
      });
    }

    this.router.navigate(['/diet/final']);
  }

  private async getInitialMealsFromBackend() : Promise<void> {
    lastValueFrom(this.dietService.getMealsAsArray(this.mealQueryInput, 0, this.pageSize*3)).then((array) => {
      this.meals = array;
    }).catch(() => {
      const alertDetails = new AlertDetails("Couldn't load meals. Please refresh the page to try again.")
      this.sharedService.emitChange(alertDetails);
    });
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
