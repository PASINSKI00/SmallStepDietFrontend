import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  constructor(private http: HttpClient, private sharedService: SharedService, private formBuilder: FormBuilder) { }

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
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    let url: string = '/api/diet';
    let body: any;

    body = this.prepareDietRqBody(diet);
    url = this.sharedService.isLoggedIn() ? url : url.concat('/unauthenticated');
    
    return this.http.post(this.address + url, body, { headers: headers, observe: 'response', responseType: 'text' as 'json' })
  }

  updateDiet(diet: Meal[][]) : Observable<any> {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    const params = {idDiet: this.sharedService.getActiveDietId().toString()};
    let url: string = '/api/diet';
    let body: any;

    body = this.prepareDietRqBody(diet);
    url = this.sharedService.isLoggedIn() ? url : url.concat('/unauthenticated');

    return this.http.put(this.address + url, body, { headers: headers, observe: 'response', responseType: 'text' as 'json', params: params })
  }

  modifyDiet(diet: FinalDiet) : Observable<any> {
    let body: any;
    let url: string = '/api/diet/final';

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

    if(this.sharedService.isLoggedIn()) {
      body = diet;
    } else {
      url = url.concat('/unauthenticated');
      body = {
        dietModifyForm: diet,
        bodyInfoForm: this.getUnauthenticatedBodyInfo().value
      }
    }

    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.put(this.address + url, body, { headers: headers, observe: 'response', responseType: 'text' as 'json' })
  }

  resetDay(idDiet: number, idFinalDay: number) {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    let url: string = '/api/diet/final/day/reset';
    let body: any;
    
    if(this.sharedService.isLoggedIn()) {
      body = null;
    } else {
      url = url.concat('/unauthenticated');
      body = this.getUnauthenticatedBodyInfo().value;
    }

    return this.http.put(this.address + url, body, { headers: headers, observe: 'response', responseType: 'text' as 'json', params: {idDiet, idFinalDay} })
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

  getUnauthenticatedBodyInfo(): FormGroup {
    let bodyInfo: FormGroup;

    bodyInfo = this.formBuilder.group({
      goal: new FormControl('LOSE_WEIGHT', [Validators.required]),
      gender: new FormControl('MALE', [Validators.required]),
      height: new FormControl(undefined, [Validators.required]),
      weight: new FormControl(undefined, [Validators.required]),
      age: new FormControl(undefined, [Validators.required, Validators.min(16)]),
      pal: new FormControl<number>(1.4, [Validators.required, Validators.min(1.4), Validators.max(2.5)]),
      additionalCalories: 0
    });
    bodyInfo.setValue(this.sharedService.readBodyInfoForm());

    return bodyInfo;
  }

  prepareDietRqBody(diet: Meal[][]): any {
    let days: number[][] = [];
    let body: any;

    diet.forEach(day => {
      let dayIds: number[] = [];
      day.forEach(meal => {
        dayIds.push(meal.idMeal);
      });
      days.push(dayIds);
    });
    if(this.sharedService.isLoggedIn() == false){
      const bodyInfo: FormGroup = this.getUnauthenticatedBodyInfo();
      body = {
        days: days,
        bodyInfoForm: bodyInfo.value
      }
    } else {
      body = days;
    }

    return body;
  }
}
