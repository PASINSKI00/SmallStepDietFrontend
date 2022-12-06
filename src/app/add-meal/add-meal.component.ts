import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Ingredient } from '../diet/ingredient';
import { Category } from '../diet/category';
import { DietService } from '../diet/diet.service';
import { faAdd, faL, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ImageService } from '../image.service';
import { interval, lastValueFrom, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.sass']
})
export class AddMealComponent implements OnInit {
  addIcon = faAdd;
  deleteIcon = faTrashAlt;
  selectedImage: File | undefined = undefined;

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

  ingredients: Ingredient[] = [];
  categories: Category[] = [];
  
  constructor(private formBuilder: FormBuilder, private dietService: DietService, private imageService: ImageService) { }
  
  onImageChanged(event: Event) {
    this.selectedImage = (event.target as HTMLInputElement).files![(event.target as HTMLInputElement).files!.length - 1];
    console.log(this.selectedImage);
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

  uploadMeal() {
    this.finalForm.setValue({
      name: this.addMealForm.value.name!,
      recipe: this.addMealForm.value.recipe!,
      ingredients: this.getMapWithIngredientsIds(),
      categoriesIds: this.getChosenCategoriesIds(),
      image: this.addMealForm.value.image!,
      timeToPrepare: this.addMealForm.value.timeToPrepare!,
    });

    this.dietService.addMeal(this.finalForm).subscribe(async (response) => {
      console.log('response.status: '+ response.status);
      if (response.status == 201) {
        window.alert("Meal added successfully!");
        
        let result: boolean = false;
        let idMeal: number = response.body;
        await this.uploadMealImage(idMeal).then((value) => {
          result = value;
        });
        if(result == false) {
          alert("Reverting upload due to image upload failure!");
          this.dietService.deleteMeal(idMeal).subscribe((response) => {
            if (response.status == 200 || response.status == 204) {
              window.alert("Meal deleted successfully!");
            } else {
              window.alert("Meal wasn't deleted :(");
            }
          });
        }

      } else {
        window.alert("Something went wrong :(");
      }
    });
  }

  private checkMealImage(): boolean {
    if (this.selectedImage == undefined){ 
      return false;
    }
    else
      return true;
  }

  private async uploadMealImage(idMeal: number): Promise<boolean> {
    let isSuccess : boolean = false;

    const response = await lastValueFrom(this.imageService.uploadMealImage(this.selectedImage!, idMeal));
    if (response.status == 200) {
      alert("Image uploaded successfully!");
      isSuccess = true;
    } else {
      alert("Image wasn't uploaded :(");
    }
    // if(this.checkMealImage()){
    //   this.imageService.uploadMealImage(this.selectedImage!).pipe(lastValueFrom()).subscribe((response) => {
    //     if (response.status == 200) {
    //       alert("Image uploaded successfully!");
    //       isSuccess = true;
    //     } else {
    //       alert("Image wasn't uploaded :(");
    //     }
    //   });

    //   return isSuccess;
    // }

    return isSuccess;
  }

  async execute() {
    const source$ = interval(2000);
    const firstNumber = await firstValueFrom(source$);
    console.log(`The first number is ${firstNumber}`);
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
