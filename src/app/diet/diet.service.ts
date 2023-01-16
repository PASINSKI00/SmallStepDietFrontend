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
  tmpMeals: Array<Meal> = [];

  constructor(private http: HttpClient, private sharedService: SharedService) { }

  uploadDiet(diet: Meal[][]) : Observable<any> {
    let dietIds: number[][] = [];

    diet.forEach(day => {
      let dayIds: number[] = [];
      day.forEach(meal => {
        dayIds.push(meal.idMeal);
      });
      dietIds.push(dayIds);
    });

    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.post(this.address + '/api/diet', dietIds, { headers: headers, observe: 'response', responseType: 'text' as 'json' })
  }

  updateDiet(diet: Meal[][]) : Observable<any> {
    let dietIds: number[][] = [];

    diet.forEach(day => {
      let dayIds: number[] = [];
      day.forEach(meal => {
        dayIds.push(meal.idMeal);
      });
      dietIds.push(dayIds);
    });

    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    const params = {idDiet: this.sharedService.activeDietId.toString()};
    return this.http.put(this.address + '/api/diet', dietIds, { headers: headers, observe: 'response', responseType: 'text' as 'json', params: params })
  }

  getDiet(idDiet: number): Observable<any> {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.get(this.address + '/api/diet', { observe: 'response', params: {idDiet}, headers: headers, responseType: 'text' as 'json' })
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
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.post(this.address + '/api/meal', mealForm.value, { observe: 'response', headers: headers, responseType: 'text' as 'json' });
  }

  deleteMeal(idMeal: number) : Observable<any> {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.delete(this.address + '/api/meal', { observe: 'response', params: {idMeal}, headers: headers, responseType: 'text' as 'json' });
  }

  getIngredientsForMeal(idMeal: number): Observable<any> {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.get(this.address + '/api/ingredient/all/meal', { observe: 'response', params:{idMeal},headers: headers, responseType: 'text' as 'json' });
  }

  getGroceries(): Observable<any> {
    const idDiet = this.sharedService.activeDietId;
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.get(this.address + '/api/diet/groceries', { observe: 'response', params:{idDiet},headers: headers, responseType: 'text' as 'json' });
  }

  getMyDiets(): Observable<any> {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.get(this.address + '/api/diet/mine', { observe: 'response', headers: headers, responseType: 'text' as 'json' });
  }
}
