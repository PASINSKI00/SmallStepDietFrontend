import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { DietComponent } from './diet/diet.component';
import { WallComponent } from './wall/wall.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OverlayModule } from '@angular/cdk/overlay';
import { LoginComponent } from './access/login/login.component';
import { SignupComponent } from './access/signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DietComponent,
    WallComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    OverlayModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
