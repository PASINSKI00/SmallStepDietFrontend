import { Injectable, Injector } from '@angular/core';
import { Subject, lastValueFrom, timer } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Meal } from './diet/meal';
import { AlertDetails } from './overlays/alert/alert-details';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { BaseComponent } from './overlays/base/base.component';
import { BaseDetails } from './overlays/base/base-details';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  shouldShowOverlay: boolean = false;
  
  private emitChangeSource = new Subject<any>();
  changeEmitted$ = this.emitChangeSource.asObservable();
  overlayRef!: OverlayRef;

  constructor(private cookieService: CookieService, private overlay: Overlay, private injector: Injector) { }

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

  logout(): boolean {
    this.cookieService.deleteAll('/');
    localStorage.getItem('activeDiet') ? localStorage.removeItem('activeDiet') : null;

    if( this.cookieService.check('authHeaderValue') || this.cookieService.check('activeDietId') || localStorage.getItem('activeDiet')) {
      const alertDetails = new AlertDetails("Something went wrong. Please try again or clear cookies manually");
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

  closeOverlay(){
    if(this.overlayRef){
      this.shouldShowOverlay = false;
      setTimeout(() => { this.overlayRef.dispose(); }, 200);
    }
  }

  async showOverlay(component: ComponentType<BaseComponent>, details?: BaseDetails, detailsType?: ComponentType<BaseDetails>){
    let componentPortal;
    let injectorWithAlertData;

    if(details && !detailsType){
      throw new Error('You need to provide details together with detailsType');
    }
    
    if(this.overlayRef){
      this.shouldShowOverlay = false;
      await lastValueFrom(timer(200));
      this.overlayRef.dispose();
    }

    if(details){
      injectorWithAlertData = Injector.create({
        providers: [
          { provide: detailsType, useValue: details },
        ],
        parent: this.injector,
      });
      componentPortal = new ComponentPortal(component, null, injectorWithAlertData);
    } else {
      componentPortal = new ComponentPortal(component);
    }
    
    this.shouldShowOverlay = true;
    this.overlayRef = this.overlay.create();
    this.overlayRef.attach(componentPortal);
  }
}
