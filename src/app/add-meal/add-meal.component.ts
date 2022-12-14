import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Ingredient } from '../diet/ingredient';
import { Category } from '../diet/category';
import { DietService } from '../diet/diet.service';
import { faAdd, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ImageService } from '../image.service';
import { lastValueFrom } from 'rxjs';
import { base64ToFile, ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.sass']
})
export class AddMealComponent implements OnInit {
  addIcon = faAdd;
  deleteIcon = faTrashAlt;

  nameOk: boolean = true;
  timeOk: boolean = true;
  ingredientsOk: boolean = true;
  ingredientOk: boolean[] = [];
  weightOk: boolean[] = [];
  categoryOk: boolean[] = [];
  recipeOk: boolean = true;

  ingredients: Ingredient[] = [];
  categories: Category[] = [];
  mealNames: string[] = [];

  imageChangedEvent: any = '';
  croppedImage: any = '';

  finalForm = this.formBuilder.group({
    name: '',
    recipe: '',
    ingredients: new FormControl<any>([]),
    categoriesIds: new FormControl<any>([]),
    image: '',
    timeToPrepare: 0,
  });

  addMealForm = this.formBuilder.group({
    name: '',
    recipe: '',
    ingredientsArray: this.formBuilder.array([]),
    categoriesArray: this.formBuilder.array([]),
    image: '',
    timeToPrepare: 15,
  });

  ingredientForm = this.formBuilder.group({
    name: '',
    weight: 0,
  });

  categoryForm = this.formBuilder.group({
    name: '',
  });

  get ingredientsArray() {
    return this.addMealForm.get('ingredientsArray') as FormArray;
  }

  get categoriesArray() {
    return this.addMealForm.get('categoriesArray') as FormArray;
  }
  
  constructor(private formBuilder: FormBuilder, private dietService: DietService, private imageService: ImageService, private router: Router) { }
  
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log("Image cropped!");
  }

  loadImageFailed() {
    console.error("Image load failed!");
  }

  ngOnInit(): void {
    this.getIngredientsFromBackend();
    this.getCategoriesFromBackend();
    this.getMealNamesFromBackend();
    this.addIngredientField();
    this.addIngredientField();
    this.addCategoryField();
  }

  checkMealName(event: any) {
    const mealName = event.target.value;
    if (this.mealNames.includes(mealName)) {
      console.error("Meal with this name already exists!");
      this.nameOk = false;
      return;
    }

    this.nameOk = true;
  }

  checkTimeToPrepare(event: any) {
    const timeToPrepare = event.target.value;
    if (timeToPrepare < 1 || timeToPrepare > 300) {
      console.error("Time to prepare must be between 1 and 300 minutes!");
      this.timeOk = false;
      return;
    }

    this.timeOk = true;
  }

  checkIngredients() {
    if (this.ingredientsArray.length < 2) {
      console.error("Meal must have at least two ingredients!");
      this.ingredientsOk = false;
      return;
    }

    this.ingredientsOk = true;
  }

  checkIngredientName(index: number) {
    const ingredientName = this.ingredientsArray.at(index).value.name;
    if (ingredientName == "" || !this.ingredients.map(ingredient => ingredient.name).includes(ingredientName)) {
      console.error("Wrong ingredient name!");
      this.ingredientOk[index] = false;
      return;
    }

    this.ingredientOk[index] = true;
  }

  checkIngredientWeight(index: number) {
    const ingredientWeight = this.ingredientsArray.at(index).value.weight;
    if (ingredientWeight < 1 || Number.isInteger(ingredientWeight) == false) {
      console.error("Ingredient weight must be at least 1gram and a natural number!");
      this.weightOk[index] = false;
      return;
    }

    this.weightOk[index] = true;
  }

  checkCategory(index: number) {
    const categoryName = this.categoriesArray.at(index).value.name;
    if (categoryName == "" || !this.categories.map(category => category.name).includes(categoryName)) {
      console.error("Category name cannot be empty and has to be from one of the provided ones!");
      this.categoryOk[index] = false;
      return;
    }

    this.categoryOk[index] = true;
  }

  checkRecipe(event: any) {
    const recipe = event.target.value;
    const words = recipe.split(/\s+/);
    if (words.length < 10) {
      console.error("Recipe must be 10 words or longer!");
      this.recipeOk = false;
      return;
    }

    this.recipeOk = true;
  }

  addIngredientField() {
    const ingredientForm = this.formBuilder.group({
      name: '',
      weight: null
    });

    this.ingredientsArray.push(ingredientForm);
    this.ingredientOk.push(true);
    this.weightOk.push(true);
    this.checkIngredients();
  }

  deleteIngredientField(index: number) {
    this.ingredientsArray.removeAt(index);
    this.checkIngredients();
    this.ingredientOk.splice(index, 1);
    this.weightOk.splice(index, 1);
  }

  addCategoryField() {
    const categoryForm = this.formBuilder.group({
      name: ''
    });

    this.categoriesArray.push(categoryForm);
    this.categoryOk.push(true);
  }

  deleteCategoryField(index: number) {
    this.categoriesArray.removeAt(index);
    this.categoryOk.splice(index, 1);
  }  

  async upload() {
    if (this.checkAllFields() == false){
      console.error("Please check your inputs!");
      alert("You didn't fill every field correctly! Please check your inputs and try again.");
      return;
    }

    this.finalForm.setValue({
      name: this.addMealForm.value.name!,
      recipe: this.addMealForm.value.recipe!,
      ingredients: this.getMapWithIngredientsIds(),
      categoriesIds: this.getChosenCategoriesIds(),
      image: this.addMealForm.value.image!,
      timeToPrepare: this.addMealForm.value.timeToPrepare!,
    });
  
    const uploadedMealId: number | undefined = await this.uploadMeal();
    if (uploadedMealId == undefined) {
      console.error("Meal wasn't created :(");
      return;
    }

    if(!this.checkMealImage()) {
      console.log("Meal was successfully created! Picture not provided.");
      return;
    }

    const imageName: string | undefined = await this.uploadMealImage(uploadedMealId);
    if (imageName == undefined) {
      console.error("Image wasn't uploaded :(");
      this.dietService.deleteMeal(uploadedMealId).subscribe((response) => {
        if (response.status != 200)
          console.error("Meal wasn't deleted :(");
      });

      console.log("Meal was successfully created!");
      return;
    }

    alert("Meal was successfully created!");
    this.router.navigate(['/diet']);
  }

  private checkMealImage(): boolean {
    if(this.croppedImage == '' || this.croppedImage == undefined || this.croppedImage == null)
      return false;

    return true;
  }

  private checkAllFields(): boolean {
    return this.nameOk && this.timeOk && this.ingredientsOk && this.recipeOk && this.categoryOk.every((value) => value == true) && this.ingredientOk.every((value) => value == true) && this.weightOk.every((value) => value == true);
  }

  private async uploadMeal() : Promise<number | undefined> {
    let idMeal: number | undefined = undefined;

    const response$ = this.dietService.addMeal(this.finalForm);
    const lastValue$ = await lastValueFrom(response$);

    if (lastValue$.status != 201)
      return;

    idMeal = lastValue$.body;

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

  private getCategoriesFromBackend() {
    this.dietService.getCategories().subscribe((response) => {
      let categoriesJSON: Array<any> = JSON.parse(response.body);
      categoriesJSON.forEach((categoryJSON: any) => {
        this.categories.push(Object.assign(new Category(categoryJSON.id, categoryJSON.name), categoryJSON));
      });
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

  private getIngredientsFromBackend() {
    this.dietService.getIngredients().subscribe((response) => {
      let ingredientsJSON: Array<any> = JSON.parse(response.body);
      ingredientsJSON.forEach((ingredientJSON: any) => {
        this.ingredients.push(Object.assign(new Ingredient(ingredientJSON.id, ingredientJSON.name), ingredientJSON));
      });
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
