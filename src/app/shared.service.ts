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

  constructor(private cookieService: CookieService) { }

  emitChange(change: any) {
    this.emitChangeSource.next(change);
  }

  setAuthHeaderValue(base64String: string) {
    this.cookieService.set('authHeaderValue', base64String);
    this.emitChange(true);
  }

  getAuthHeaderValue() {
    return this.cookieService.get('authHeaderValue');
  }

  isLoggedIn() {
    return this.cookieService.check('authHeaderValue');
  }

  logout() {
    this.cookieService.delete('authHeaderValue');
    this.cookieService.delete('activeDietId');
    this.cookieService.delete('activeDiet');
    this.emitChange(false);
  }

  setActiveDietId(id: number) {
    this.cookieService.set('activeDietId', id.toString());
  }

  getActiveDietId() {
    return parseInt(this.cookieService.get('activeDietId')? this.cookieService.get('activeDietId') : '-1');
  }

  setActiveDiet(diet: Array<Array<Meal>>) {
    this.cookieService.set('activeDiet', JSON.stringify(diet));
  }

  getActiveDiet() {
    return JSON.parse(this.cookieService.get('activeDiet') ? this.cookieService.get('activeDiet') : '[]');
  }
}
