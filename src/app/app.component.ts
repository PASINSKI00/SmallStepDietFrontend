import { Component } from '@angular/core';
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { LoginComponent } from "./overlays/login/login.component";
import { SignupComponent } from "./overlays/signup/signup.component";
import { SharedService } from './shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'frontend';
  overlayRef!: OverlayRef;

  constructor(private overlay: Overlay, private _sharedService: SharedService, private router: Router) {
    _sharedService.changeEmitted$.subscribe( text => {
      if(text == 'closeOverlay')
        this.closeOverlay();
      else if(text == 'loginOverlay')
        this.loginOverlay();
      else if(text == 'signupOverlay')
        this.signupOverlay();
      else if(text == 'message')
        alert('message');
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

  // redirectOverlay(message: string, url: string){
  //   this.closeOverlay();
  //   this.overlayRef = this.overlay.create();
  //   const componentPortal = new ComponentPortal();
  //   this.overlayRef.attach(componentPortal);
  // }

  closeOverlay(){
    if(this.overlayRef)
      this.overlayRef.dispose();
  }
}
