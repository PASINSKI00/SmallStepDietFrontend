import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl, Validators, ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';
import { Ingredient } from '../diet/ingredient';
import { Category } from '../diet/category';
import { DietService } from '../diet/diet.service';
import { faAdd, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ImageService } from '../image.service';
import { lastValueFrom } from 'rxjs';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Router } from '@angular/router';
import { AlertDetails } from '../overlays/alert/alert-details';
import { SharedService } from '../shared.service';
import { RedirectDetails } from '../overlays/redirect/redirect-details';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.sass']
})
export class AddMealComponent implements OnInit {
  addIcon = faAdd;
  deleteIcon = faTrashAlt;

  ingredients: Ingredient[] = [];
  categories: Category[] = [];
  mealNames: string[] = [];

  imageChangedEvent: any = '';
  croppedImage: any = '';

  isUploading: boolean = false;

  addMealForm = this.formBuilder.group({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    recipe: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(4096)]),
    ingredientsArray: this.formBuilder.array([], [Validators.required, Validators.minLength(1)]),
    categoriesArray: this.formBuilder.array([], [Validators.required, Validators.minLength(1)]),
    image: '',
    timeToPrepare: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(999)])
  });

  get ingredientsArray() {
    return this.addMealForm.get('ingredientsArray') as FormArray;
  }

  get categoriesArray() {
    return this.addMealForm.get('categoriesArray') as FormArray;
  }
  
  constructor(private formBuilder: FormBuilder, private dietService: DietService, private imageService: ImageService, 
    private router: Router, private sharedService: SharedService) { }
  
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  loadImageFailed() {
    console.error("Image load failed!");
  }

  async ngOnInit(): Promise<void> {
    await this.getIngredientsFromBackend();
    await this.getCategoriesFromBackend();
    this.getMealNamesFromBackend();
    this.addIngredientField();
    this.addCategoryField();
  }

  inArrayValidator(array: any[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
  
      if (array.includes(value)) {
        return null; // Value is valid, return null
      }
  
      return { inArray: true }; // Value is not in the array, return an error object
    };
  }

  addIngredientField() {
    let ingredientForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, this.inArrayValidator(this.ingredients.map(ingredient => ingredient.name))]),
      weight: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(9999)])
    });

    this.ingredientsArray.push(ingredientForm);
  }

  deleteIngredientField(index: number) {
    if(this.ingredientsArray.length > 1) {
      this.ingredientsArray.removeAt(index);
    }
  }

  addCategoryField() {
    let categoryForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, this.inArrayValidator(this.categories.map(category => category.name))])
    });

    this.categoriesArray.push(categoryForm);
  }

  deleteCategoryField(index: number) {
    if(this.categoriesArray.length > 1) {
      this.categoriesArray.removeAt(index);
    }
  }  

  async upload() {
    this.isUploading = true;
    let finalForm = this.formBuilder.group({
      name: new FormControl(this.addMealForm.value.name!, [Validators.required]),
      recipe: new FormControl(this.addMealForm.value.recipe!, [Validators.required]),
      ingredients: new FormControl(this.getMapWithIngredientsIds(), [Validators.required]),
      categoriesIds: new FormControl(this.getChosenCategoriesIds(), [Validators.required]),
      image: new FormControl(this.addMealForm.value.image!, [Validators.required]),
      timeToPrepare: new FormControl(this.addMealForm.value.timeToPrepare!, [Validators.required]),
    });
  
    const uploadedMealId: number | undefined = await this.uploadMeal(finalForm);
    if (uploadedMealId == undefined) {
      this.isUploading = false;
      return;
    }

    if(this.checkMealImage()) {
      const imageName: string | undefined = await this.uploadMealImage(uploadedMealId);
      if (imageName == undefined) {
        const alertDetails = new AlertDetails("There were issues with uploading the image :( Please try again");
        this.sharedService.emitChange(alertDetails);
        this.dietService.deleteMeal(uploadedMealId);
        this.isUploading = false;
        return;
      }
    }

    const redirectDetails = new RedirectDetails("Meal successfully created", '/diet/meal/' + uploadedMealId, true);
    this.sharedService.emitChange(redirectDetails);
    this.isUploading = false;
    return;
  }

  private checkMealImage(): boolean {
    if(this.croppedImage == '' || this.croppedImage == undefined || this.croppedImage == null)
      return false;

    return true;
  }

  private async uploadMeal(finalForm: FormGroup) : Promise<number | undefined> {
    let idMeal: number | undefined = undefined;

    await lastValueFrom(this.dietService.addMeal(finalForm)).then((response) => {
      idMeal = response.body
    }).catch(() => {
      const alertDetails = new AlertDetails("Meal wasn't created. Please try again");
      this.sharedService.emitChange(alertDetails);
    });

    return idMeal;
  }

  private async uploadMealImage(idMeal: number): Promise<string | undefined> {
    let imageName : string | undefined = undefined;

    const response$ = this.imageService.uploadMealImage(this.croppedImage, idMeal);
    const lastValue$ = await lastValueFrom(response$);

    if (lastValue$.status != 200)
      return;

    imageName = lastValue$.body;

    return imageName;
  }

  private async getCategoriesFromBackend() {
    const response$ = this.dietService.getCategories();
    const lastValue$ = await lastValueFrom(response$);

    JSON.parse(lastValue$.body).forEach((categoryJSON: any) => {
      this.categories.push(Object.assign(new Category(categoryJSON.id, categoryJSON.name), categoryJSON));
    });
  }

  private getChosenCategoriesIds(): Array<number> {
    let ids: Array<number> = [];

    this.categoriesArray.controls.forEach((categoryForm) => {
      let categoryName: string = categoryForm.value.name;
      if (categoryName != '') {
        let category: Category = this.categories.find((category) => category.name == categoryName)!;
        ids.push(category.idCategory);
      }
    });    
    return ids;
  }

  private async getIngredientsFromBackend() {
    const response$ = this.dietService.getIngredients();
    const lastValue$ = await lastValueFrom(response$);

    JSON.parse(lastValue$.body).forEach((ingredientJSON: any) => {
      this.ingredients.push(Object.assign(new Ingredient(ingredientJSON.id, ingredientJSON.name), ingredientJSON));
    });
  }

  private getMapWithIngredientsIds() : Map<number, number> {
    let tmpChosenIngredients: Map<number, number> = new Map;
    this.ingredientsArray.controls.forEach((ingredientForm) => {
      let ingredientName: string = ingredientForm.value.name;
      if (ingredientName != '') {
        let ingredient: Ingredient = this.ingredients.find((ingredient) => ingredient.name == ingredientName)!;
        tmpChosenIngredients.set(ingredient.idIngredient, ingredientForm.value.weight);
      }
    });

    let customJsonDefinition: string = "";
    tmpChosenIngredients.forEach((value, key) => {
      customJsonDefinition += `"${key}": ${value},`;
    });
    customJsonDefinition = customJsonDefinition.substring(0, customJsonDefinition.length - 1);
    customJsonDefinition = `{${customJsonDefinition}}`;
    
    return JSON.parse(customJsonDefinition);
  }

  private getMealNamesFromBackend() {
    this.dietService.getMeals().subscribe((response) => {
      let mealsJSON: Array<any> = JSON.parse(response.body);
      mealsJSON.forEach((mealJSON: any) => {
        this.mealNames.push(mealJSON.name);
      });
    });
  }
}
