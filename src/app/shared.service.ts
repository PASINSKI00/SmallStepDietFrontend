import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Meal } from './diet/meal';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private emitChangeSource = new Subject<any>();
  changeEmitted$ = this.emitChangeSource.asObservable();
  isLoggedIn: boolean = false;
  diet: Array<Array<Meal>> = new Array<Array<Meal>>();

  constructor(private cookieService: CookieService) { }

  setDiet(diet: Array<Array<Meal>>) {
    this.diet = diet;
    this.cookieService.set('diet', JSON.stringify(diet));
  }

  getDiet() : Array<Array<Meal>> {
    if (this.diet.length == 0) {
      this.diet = JSON.parse(this.cookieService.get('diet'));
    }
    
    return this.diet;
  }

  emitChange(change: any) {
    this.emitChangeSource.next(change);
  }

  setAuthHeader(base64String: string) {
    this.cookieService.set('authHeaderValue', base64String);
  }

  getAuthHeader() {
    return this.cookieService.get('authHeaderValue');
  }

  setIsLoggedIn(isLoggedIn: boolean) {
    this.isLoggedIn = isLoggedIn;
  }
}
