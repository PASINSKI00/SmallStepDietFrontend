import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { SharedService } from '../shared.service';
import { Meal } from './meal';
import { Ingredient } from './ingredient';

@Injectable({
  providedIn: 'root'
})
export class DietService {
  address = 'http://localhost:8080';
  diet: Array<Array<Meal>> = [];

  constructor(private http: HttpClient, private sharedService: SharedService) { }

  setDiet(diet: Array<Array<Meal>>) {
    this.diet = diet;
  }

  getDiet() : Array<Array<Meal>> {
    let meals: Array<Meal> = [];
    meals.push(new Meal(1, "White rice with vegetables and some other stuff", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    meals.push(new Meal(2, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    meals.push(new Meal(3, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    meals.push(new Meal(4, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    meals.push(new Meal(5, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    meals.push(new Meal(6, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    meals.push(new Meal(7, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    meals.push(new Meal(8, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    meals.push(new Meal(9, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    meals.push(new Meal(10, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    meals.push(new Meal(11, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));
    meals.push(new Meal(12, "White rice with vegetables", ["white rice", "cucumber", "tomato", "onion"], 7, "/assets/images/Hot_meal_header.png" ));

    this.diet.push([]);
    this.diet.push([]);
    this.diet.push([]);
    this.diet.push([]);

    this.diet[0].push(meals[0]);
    this.diet[0].push(meals[1]);
    this.diet[0].push(meals[2]);
    this.diet[0].push(meals[3]);
    this.diet[1].push(meals[4]);
    this.diet[1].push(meals[5]);
    this.diet[1].push(meals[6]);
    this.diet[1].push(meals[7]);
    this.diet[2].push(meals[8]);
    this.diet[2].push(meals[9]);
    this.diet[2].push(meals[10]);
    this.diet[3].push(meals[11]);

    return this.diet;
  }

  getMeals() : Observable<any> {
    return this.http.get(this.address + '/api/meal/search', { observe: 'response', responseType: 'text' as 'json' })
  }

  getCategories() : Observable<any> {
    return this.http.get(this.address + '/api/category/all', { observe: 'response', responseType: 'text' as 'json' })
  }

  getIngredients() : Observable<any> {
    return this.http.get(this.address + '/api/ingredient/all', { observe: 'response', responseType: 'text' as 'json' })
  }

  addMeal(mealForm: FormGroup) : Observable<any> {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeader()});
    return this.http.post(this.address + '/api/meal', mealForm.value, { observe: 'response', headers: headers, responseType: 'text' as 'json' });
  }

  deleteMeal(idMeal: number) : Observable<any> {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeader()});
    return this.http.delete(this.address + '/api/meal', { observe: 'response', params: {idMeal}, headers: headers, responseType: 'text' as 'json' });
  }

  getIngredientsByNames(ingredientsNames: String[]): Observable<any> {
    return this.http.get(this.address + '/api/ingredient/byNames', { observe: 'response', responseType: 'text' as 'json' });
  }
}
