import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Meal } from './meal';
import { faTrashAlt, faAdd, faAnglesDown, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Category } from './category';
import { DietService } from './diet.service';
import { SharedService } from '../shared.service';
import { lastValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { BodyInfoService } from '../account/body-info/body-info.service';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { RedirectDetails } from '../overlays/redirect/redirect-details';
import { AlertDetails } from '../overlays/alert/alert-details';
import { slideFromTop } from '../animations';

@Component({
  selector: 'app-diet',
  templateUrl: './diet.component.html',
  styleUrls: ['./diet.component.sass'],
  animations: [
    slideFromTop
  ]
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

  noMoreMeals: boolean = false;
  isLoading: boolean = false;
  isLoadingTop: boolean = false;
  isLoadingBottom: boolean = false;
  isUploading: boolean  = false;
  isSearching: boolean = false;
  isSingleMealLoading: boolean = false;

  mealQueryInput = this.formBuilder.group({
    nameContains: '',
    sortBy: '',
    categories: this.formBuilder.array([]),
  });

  constructor(
    private bodyInfoService: BodyInfoService, private dietService: DietService, private sharedService: SharedService, 
    private router: Router, private formBuilder: FormBuilder, private route: ActivatedRoute) 
    {
      this.route.params.subscribe( params => 
        {
          if(params['id'])
            this.showSingleMeal(params['id']);       
        }
      );
    }

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
      this.noMoreMeals = false;
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

  async appendMealsAtTheStart() {
    if(this.firstPageNumber == 0)
      return;
  
    console.log("Appending meals at the start");
    this.isLoadingTop = true;
    await lastValueFrom(this.dietService.getMealsAsArray(this.mealQueryInput, this.firstPageNumber-1, this.pageSize)).then((array) => {
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
    this.isLoadingTop = false;
  }

  appendMealsAtTheBack() {
    console.log("Appending meals at the back");
    this.isLoadingBottom = true;
    lastValueFrom(this.dietService.getMealsAsArray(this.mealQueryInput, this.lastPageNumber+1, this.pageSize)).then((array) => {
      this.isLoadingBottom = false;
      if(array.length == 0){
        this.noMoreMeals = true;
        return;
      }

      this.meals.push(...array);
      this.meals.splice(0, array.length);
      this.firstPageNumber++;
      this.lastPageNumber++;
    }).catch(() => {
      const alertDetails = new AlertDetails("Something went wrong when getting new meals")
      this.sharedService.emitChange(alertDetails);
      this.isLoadingBottom = false;
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

  async searchClicked(){
    this.isSearching = true;
    await this.getInitialMealsFromBackend();
    this.formUpdated = false;
    this.isSearching = false;
    this.filtersVisible = false;
  }

  async showSingleMeal(idMeal: number){
    this.singleMealVisible = true;
    this.isSingleMealLoading = true;
    await lastValueFrom(this.dietService.extendedMeal(idMeal)).then((response) => {
      let mealJSON = JSON.parse(response.body);
      this.singleMeal = new Meal(mealJSON.idMeal, mealJSON.name, mealJSON.ingredientsNames, mealJSON.rating, 
        mealJSON.imageUrl, mealJSON.avgRating, mealJSON.proteinRatio, mealJSON.timesUsed, mealJSON.recipe, 
        mealJSON.timeToPrepare, mealJSON.carbsRatio, mealJSON.fatsRatio, mealJSON.reviews)
    }).catch(() => {
      const alertDetails = new AlertDetails("Couldn't load meal. Please try again.");
      this.sharedService.emitChange(alertDetails);
    });
    this.isSingleMealLoading = false;
  }

  async continue() {
    let isFailed = false;
    this.isUploading = true;
    this.sharedService.setActiveDiet(this.diet);

    for(let i = this.diet.length-1 ; i >= 0 ; i--) {
      if(this.diet[i].length == 0) {
        this.removeDayFromDiet(i);
      }
    }

    if(this.diet.length == 0 && !isFailed) {
      const alertDetails = new AlertDetails("Diet is empty. Please add meals.");
      this.sharedService.emitChange(alertDetails);
      this.addDayToDiet();
      isFailed = true
    }

    if(!this.sharedService.isLoggedIn() && !isFailed) {
      const redirectDetails = new RedirectDetails("You need to be logged in to continue", "login");
      this.sharedService.emitChange(redirectDetails);
      isFailed = true
    }

    if(!this.isBodyInfoSet && !isFailed) {
      const redirectDetails = new RedirectDetails("Body information missing", "/account/bodyinfo");
      this.sharedService.emitChange(redirectDetails);
      isFailed = true
    }

    if(this.sharedService.getActiveDietId() != -1 && !isFailed)  {
      await lastValueFrom(this.dietService.updateDiet(this.diet))
        .catch((error) => {
          if (error.status == 404) {
            this.sharedService.setActiveDietId(-1);
            return;
          }

          const alertDetails = new AlertDetails("Diet wasn't updated. Please try again.");
          this.sharedService.emitChange(alertDetails);
          isFailed = true;
        });
    }

    if(this.sharedService.getActiveDietId() == -1 && !isFailed) {
      await lastValueFrom(this.dietService.uploadDiet(this.diet)).then((response) => {
        this.sharedService.setActiveDietId(JSON.parse(response.body));
      }).catch(() => {
        const alertDetails = new AlertDetails("Diet wasn't created. Please try again.");
        this.sharedService.emitChange(alertDetails);
        isFailed = true;
      });
    }

    this.isUploading = false;

    if(isFailed) return;

    this.router.navigate(['/diet/final']);
  }

  private async getInitialMealsFromBackend() : Promise<void> {
    this.isLoading = true;
    await lastValueFrom(this.dietService.getMealsAsArray(this.mealQueryInput, 0, this.pageSize*3)).then((array) => {
      this.meals = array;
    }).catch(() => {
      const alertDetails = new AlertDetails("Couldn't load meals. Please refresh the page to try again.")
      this.sharedService.emitChange(alertDetails);
    });
    this.isLoading = false;
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
