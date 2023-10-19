import { Component, Injector } from '@angular/core';
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { LoginComponent } from "./overlays/login/login.component";
import { SignupComponent } from "./overlays/signup/signup.component";
import { SharedService } from './shared.service';
import { Router } from '@angular/router';
import { RedirectDetails } from './overlays/redirect/redirect-details';
import { RedirectComponent } from './overlays/redirect/redirect.component';
import { AlertDetails } from './overlays/alert/alert-details';
import { AlertComponent } from './overlays/alert/alert.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'frontend';
  overlayRef!: OverlayRef;

  constructor(private overlay: Overlay, private _sharedService: SharedService, private router: Router, private injector: Injector) {
    _sharedService.changeEmitted$.subscribe( change => {
      if(change == 'closeOverlay')
        this.closeOverlay();
      else if(change == 'loginOverlay')
        this.loginOverlay();
      else if(change == 'signupOverlay')
        this.signupOverlay();
      else if(change instanceof RedirectDetails)
        this.redirectOverlay(change);
      else if(change instanceof AlertDetails)
        this.alertOverlay(change);
      });
   }

  loginOverlay(){
    this.closeOverlay();
    this.overlayRef = this.overlay.create();
    const componentPortal = new ComponentPortal(LoginComponent);
    this.overlayRef.attach(componentPortal);
  }

  signupOverlay(){
    this.closeOverlay();
    this.overlayRef = this.overlay.create();
    const componentPortal = new ComponentPortal(SignupComponent);
    this.overlayRef.attach(componentPortal);
  }

  redirectOverlay(details: RedirectDetails){
    this.closeOverlay();
    this.overlayRef = this.overlay.create();
    const injectorWithRedirectData = Injector.create({
      providers: [
        { provide: RedirectDetails, useValue: details },
      ],
      parent: this.injector,
    });
    const componentPortal = new ComponentPortal(RedirectComponent, null, injectorWithRedirectData);
    this.overlayRef.attach(componentPortal);
  }

  alertOverlay(details: AlertDetails){
    this.closeOverlay();
    this.overlayRef = this.overlay.create();
    const injectorWithAlertData = Injector.create({
      providers: [
        { provide: AlertDetails, useValue: details },
      ],
      parent: this.injector,
    });
    const componentPortal = new ComponentPortal(AlertComponent, null, injectorWithAlertData);
    this.overlayRef.attach(componentPortal);
  }

  closeOverlay(){
    if(this.overlayRef)
      this.overlayRef.dispose();
  }
}
