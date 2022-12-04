import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Meal } from './meal';
import { map, catchError } from 'rxjs/operators';
// import * as Rx from "rxjs/Rx";
import { from, Observable, throwError } from 'rxjs';
import { AddMealComponent } from '../add-meal/add-meal.component';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DietService {
  address = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

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
    return this.http.post(this.address + '/api/meal', mealForm.value);
  }
}
