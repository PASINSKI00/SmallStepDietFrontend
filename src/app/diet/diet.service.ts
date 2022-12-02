import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Meal } from './meal';
import { map, catchError } from 'rxjs/operators';
// import * as Rx from "rxjs/Rx";
import { from, Observable, throwError } from 'rxjs';

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
}
