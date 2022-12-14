import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private emitChangeSource = new Subject<any>();
  changeEmitted$ = this.emitChangeSource.asObservable();
  isLoggedIn: boolean = false;
  activeDietId: number = null!;

  constructor(private cookieService: CookieService) { }

  emitChange(change: any) {
    this.emitChangeSource.next(change);
  }

  setAuthHeaderValue(base64String: string) {
    this.cookieService.set('authHeaderValue', base64String);
  }

  getAuthHeaderValue() {
    return this.cookieService.get('authHeaderValue');
  }
}
