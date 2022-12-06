import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root'
})
export class DietService {
  address = 'http://localhost:8080';

  constructor(private http: HttpClient, private sharedService: SharedService) { }

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
}
