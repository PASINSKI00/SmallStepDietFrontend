import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { SharedService } from '../shared.service';
import { Meal } from './meal';
import { FinalDiet } from './final-diet/final-diet';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DietService {
  address = environment.backendUrl;
  tmpMeals: Array<Meal> = [];

  constructor(private http: HttpClient, private sharedService: SharedService) { }

  getMeals() : Observable<any> {
    return this.http.get(this.address + '/api/meal/search', { observe: 'response', responseType: 'text' as 'json' })
  }

  getMealsAsArray(queryForm: FormGroup, pageNumber: number, pageSize: number) : Observable<Array<Meal>> {
    const nameContains: string = queryForm.get('nameContains')?.value;
    const sortBy: string = queryForm.get('sortBy')?.value;
    const categories: Array<string> = queryForm.get('categories')?.value;
    return this.http.get(this.address + '/api/meal/search', { observe: 'body', params: {nameContains, sortBy, categories, pageNumber, pageSize}, responseType: 'json'}).pipe(
      map((body: any) => {
        return body.map((meal: any) => {
          return new Meal(meal.idMeal, meal.name, meal.ingredientsNames, meal.rating, meal.imageUrl, meal.avgRating, meal.proteinRatio, meal.timesUsed)
        })
      })
    )
  }

  extendedMeal(idMeal: number) : Observable<any> {
    return this.http.get(this.address + '/api/meal/extend', { observe: 'response', params: {idMeal}, responseType: 'text' as 'json' })
  }

  getUnreviewedMealsFromMyDiets() : Observable<any> {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.get(this.address + '/api/diet/mine/meals/unreviewed', { observe: 'response', headers: headers, responseType: 'text' as 'json' })
  }

  getCategories() : Observable<any> {
    return this.http.get(this.address + '/api/category/all', { observe: 'response', responseType: 'text' as 'json' })
  }

  getIngredients() : Observable<any> {
    return this.http.get(this.address + '/api/ingredient/all', { observe: 'response', responseType: 'text' as 'json' })
  }

  getGroceries(): Observable<any> {
    const idDiet = this.sharedService.getActiveDietId();
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.get(this.address + '/api/diet/groceries', { observe: 'response', params:{idDiet},headers: headers, responseType: 'text' as 'json' });
  }

  getGroceriesById(idDiet: number): Observable<any> {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.get(this.address + '/api/diet/groceries', { observe: 'response', params:{idDiet},headers: headers, responseType: 'text' as 'json' });
  }

  getMyDiets(): Observable<any> {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.get(this.address + '/api/diet/mine', { observe: 'response', headers: headers, responseType: 'text' as 'json' });
  }

  getDiet(idDiet: number): Observable<any> {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.get(this.address + '/api/diet', { observe: 'response', params: {idDiet}, headers: headers, responseType: 'text' as 'json' })
  }

  addMeal(mealForm: FormGroup) : Observable<any> {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.post(this.address + '/api/meal', mealForm.value, { observe: 'response', headers: headers, responseType: 'text' as 'json' });
  }

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
    const params = {idDiet: this.sharedService.getActiveDietId().toString()};
    return this.http.put(this.address + '/api/diet', dietIds, { headers: headers, observe: 'response', responseType: 'text' as 'json', params: params })
  }

  modifyDiet(diet: FinalDiet) : Observable<any> {
    diet.finalDays.forEach(day => {
      day.finalMeals.forEach(meal => {
        if(meal.percentModified != true) {
          meal.percentModified = false;
        }
      });

      if(day.finalMeals.every(meal => meal.percentModified == false)) {
        day.finalMeals.forEach(meal => {
          meal.percentOfDay = null;
        });
      }

      day.finalMeals.forEach(meal => {
        meal.finalIngredients = meal.finalIngredients.filter(ingredient => ingredient.modified);
      });
    });

    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.put(this.address + '/api/diet/final', diet, { headers: headers, observe: 'response', responseType: 'text' as 'json' })
  }

  resetDay(idDiet: number, idFinalDay: number) {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.put(this.address + '/api/diet/final/day/reset', null, { headers: headers, observe: 'response', responseType: 'text' as 'json', params: {idDiet, idFinalDay} })
  }

  reCalculateDiet(idDiet: number) {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.put(this.address + '/api/diet/final/recalculate', null, { headers: headers, observe: 'response', responseType: 'text' as 'json', params: {idDiet} })
  }

  //TODO: move to different service
  deleteMeal(idMeal: number) : Observable<any> {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.delete(this.address + '/api/meal', { observe: 'response', params: {idMeal}, headers: headers, responseType: 'text' as 'json' });
  }
}
