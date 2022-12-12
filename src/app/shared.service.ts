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
  activeDietId: number = 1;

  constructor(private cookieService: CookieService) { }

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

  setActiveDietId(id: number) {
    
  }
}
