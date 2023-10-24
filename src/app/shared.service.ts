import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Meal } from './diet/meal';
import { AlertDetails } from './overlays/alert/alert-details';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private emitChangeSource = new Subject<any>();
  changeEmitted$ = this.emitChangeSource.asObservable();

  constructor(private cookieService: CookieService) { }

  emitChange(change: any) {
    this.emitChangeSource.next(change);
  }

  setAuthHeaderValue(base64String: string) {
    this.cookieService.set('authHeaderValue', base64String,7,"/");
  }

  getAuthHeaderValue() {
    return this.cookieService.get('authHeaderValue');
  }

  deleteAuthHeaderValue() {
    this.cookieService.delete('authHeaderValue');
  }

  isLoggedIn() {
    return this.cookieService.check('authHeaderValue');
  }

  logout() {
    this.cookieService.check('authHeaderValue') ? this.cookieService.delete('authHeaderValue') : null;
    this.cookieService.check('activeDietId') ? this.cookieService.delete('activeDietId') : null;
    localStorage.getItem('activeDiet') ? localStorage.removeItem('activeDiet') : null;

    if( this.cookieService.check('authHeaderValue') || this.cookieService.check('activeDietId') || localStorage.getItem('activeDiet')) {
      const alertDetails = new AlertDetails("Something went wrong with the logout. Please try again.");
      this.emitChange(alertDetails);
      return false;
    }
    
    this.emitChange('userNotLoggedIn');
    return true;
  }

  setActiveDietId(id: number) {
    this.cookieService.set('activeDietId', id.toString());
  }

  getActiveDietId() {
    return parseInt(this.cookieService.check('activeDietId')? this.cookieService.get('activeDietId') : '-1');
  }

  setActiveDiet(diet: Array<Array<Meal>>) {
    localStorage.setItem('activeDiet', JSON.stringify(diet));
  }

  getActiveDiet() {
    return JSON.parse(localStorage.getItem('activeDiet') ? localStorage.getItem('activeDiet')! : '[]');
  }

  checkActiveDiet() {
    return localStorage.getItem('activeDiet') ? true : false;
  }

  clearActiveDiet() {
    localStorage.removeItem('activeDiet');
    this.cookieService.delete('activeDietId');
  }
}
