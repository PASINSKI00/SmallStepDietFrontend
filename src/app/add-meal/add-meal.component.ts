import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
import { Ingredient } from '../diet/ingredient';
import { Category } from '../diet/category';
import { DietService } from '../diet/diet.service';
import { faAdd } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.sass']
})
export class AddMealComponent implements OnInit {
  addIcon = faAdd;
  mealForm = this.formBuilder.group({
    name: '',
    recipe: '',
    ingredients: '',
    categoriesIds: this.formBuilder.array([]),
    image: '',
    timeToPrepare: 0,
  });

  ingredients: Ingredient[] = [];
  chosenIngredients: Map<string, number> = new Map;
  chosenIngredientsNames: Array<string> = [];
  categories: Category[] = [];
  chosenCategories: number[] = [];
  
  constructor(private formBuilder: FormBuilder, private dietService: DietService) { }
  
  ngOnInit(): void {
    this.getIngredientsFromBackend();
    this.getCategoriesFromBackend();
    this.chosenIngredients.set('0', 0);
    this.chosenCategories.push(0);
  }

  // addIngredient(ingredient: Ingredient, weight: number) {
  //   this.chosenIngredients.set(ingredient.name, weight);
  // }

  addIngredientField() {
    const index = this.chosenIngredients.size;
    this.chosenIngredients.set(index.toString(), 0);
  }

  private getIngredientsFromBackend() {
    this.dietService.getIngredients().subscribe((response) => {
      let ingredientsJSON: Array<any> = JSON.parse(response.body);
      ingredientsJSON.forEach((ingredientJSON: any) => {
        this.ingredients.push(Object.assign(new Ingredient(ingredientJSON.id, ingredientJSON.name), ingredientJSON));
      });
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

  addCategoryField() {
    this.chosenCategories.push(this.chosenCategories.length);
  }

  uploadMeal() {
    this.mealForm.patchValue({
      ingredients: this.getIngredientsJsonString()
    });
    console.log(this.getIngredientsJsonString());
  }
    
  private getIngredientsJsonString() : string {
    let ingredientsJsonString = '';
    let tmpChosenIngredients: Map<number, number> = new Map;

    tmpChosenIngredients = this.getMapWithIngredientsIds();

    ingredientsJsonString += '{';
    tmpChosenIngredients.forEach((weight: number, id: number) => {
      ingredientsJsonString += '"' + id + '":' + weight + ',';
    });
    ingredientsJsonString = ingredientsJsonString.substring(0, ingredientsJsonString.length - 1);
    ingredientsJsonString += '}';

    return ingredientsJsonString;
  }

  private getMapWithIngredientsIds() : Map<number, number> {
    let tmpChosenIngredients: Map<number, number> = new Map;
    this.chosenIngredients.forEach((weight: number, name: string) => {
      tmpChosenIngredients.set(this.getIngredientId(name), weight);
    });
    return tmpChosenIngredients;
  }

  private getIngredientId(name: string) : number {
    let id: number = 0;
    this.ingredients.forEach((ingredient: Ingredient) => {
      if (ingredient.name == name) {
        id = ingredient.idIngredient;
      }
    });
    return id;
  }
}
