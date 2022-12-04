import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Ingredient } from '../diet/ingredient';
import { Category } from '../diet/category';
import { DietService } from '../diet/diet.service';
import { faAdd, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.sass']
})
export class AddMealComponent implements OnInit {
  addIcon = faAdd;
  deleteIcon = faTrashAlt;

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
  
  constructor(private formBuilder: FormBuilder, private dietService: DietService) { }
  
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
    console.log(this.addMealForm.value);
    console.log(this.finalForm.value);
    this.dietService.addMeal(this.finalForm).subscribe((response) => {
      console.log(response);
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
    console.log(customJsonDefinition);
    
    return JSON.parse(customJsonDefinition);

    return tmpChosenIngredients;
  }
}
