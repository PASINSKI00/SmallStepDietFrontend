import { Component } from '@angular/core';
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { LoginComponent } from "./access/login/login.component";
import { SignupComponent } from "./access/signup/signup.component";
import { SharedService } from './shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'frontend';
  overlayRef!: OverlayRef;

  constructor(private overlay: Overlay, private _sharedService: SharedService) {
    _sharedService.changeEmitted$.subscribe( text => {
      if(text == 'closeAccess')
        this.closeAccess();
      else if(text == 'login')
        this.login();
      else if(text == 'signup')
        this.signup();
      });
   }

  access() {
    this.login();
  }

  login(){
    this.closeAccess();
    this.overlayRef = this.overlay.create();
    const componentPortal = new ComponentPortal(LoginComponent);
    this.overlayRef.attach(componentPortal);
  }

  signup(){
    this.closeAccess();
    this.overlayRef = this.overlay.create();
    const componentPortal = new ComponentPortal(SignupComponent);
    this.overlayRef.attach(componentPortal);
  }

  closeAccess(){
    if(this.overlayRef)
      this.overlayRef.dispose();
  }
}
