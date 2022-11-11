import { Component } from '@angular/core';
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { LoginComponent } from "./access/login/login.component";
import { SignupComponent } from "./access/signup/signup.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'frontend';
  overlayRef!: OverlayRef;

  constructor(private overlay: Overlay) { }

  access() {
    this.login();
  }

  login(){
    this.overlayRef = this.overlay.create();
    const componentPortal = new ComponentPortal(LoginComponent);
    this.overlayRef.attach(componentPortal);
  }

  signup(){
    this.overlayRef = this.overlay.create();
    const componentPortal = new ComponentPortal(SignupComponent);
    this.overlayRef.attach(componentPortal);
  }
}
