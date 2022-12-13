import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Ingredient } from '../diet/ingredient';
import { Category } from '../diet/category';
import { DietService } from '../diet/diet.service';
import { faAdd, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ImageService } from '../image.service';
import { lastValueFrom } from 'rxjs';
import { base64ToFile, ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

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
  
  constructor(private formBuilder: FormBuilder, private dietService: DietService, private imageService: ImageService) { }
  
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
    this.addIngredientField();
    this.addCategoryField();
  }

  addIngredientField() {
    const ingredientForm = this.formBuilder.group({
      name: '',
      weight: 100
    });

    this.ingredientsArray.push(ingredientForm);
  }

  deleteIngredientField(index: number) {
    this.ingredientsArray.removeAt(index);
  }

  addCategoryField() {
    const categoryForm = this.formBuilder.group({
      name: ''
    });

    this.categoriesArray.push(categoryForm);
  }

  deleteCategoryField(index: number) {
    this.categoriesArray.removeAt(index);
  }  

  async upload() {
    if (!this.checkMealImage()){
      console.error("Please choose an image!");
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
  }

  private checkMealImage(): boolean {
    if(this.croppedImage == '' || this.croppedImage == undefined || this.croppedImage == null)
      return false;

    console.log("Image is ok!");
    console.log("croppedImage: " + this.croppedImage);
    console.log("base64: " + this.croppedImage.base64);
    console.log("base64tofile: " + base64ToFile(this.croppedImage));
    console.log("file: ", this.croppedImage.file)

    return true;
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
}
