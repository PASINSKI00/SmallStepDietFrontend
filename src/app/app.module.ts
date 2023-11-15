import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { DietComponent } from './diet/diet.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OverlayModule } from '@angular/cdk/overlay';
import { LoginComponent } from './overlays/login/login.component';
import { SignupComponent } from './overlays/signup/signup.component';
import { BaseComponent } from './overlays/base/base.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { AddMealComponent } from './add-meal/add-meal.component';
import { FormsModule } from '@angular/forms';
import { FinalDietComponent } from './diet/final-diet/final-diet.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { GroceriesComponent } from './diet/groceries/groceries.component';
import { FinishedComponent } from './diet/finished/finished.component';
import { DietHistoryComponent } from './account/diet-history/diet-history.component';
import { BodyInfoComponent } from './account/body-info/body-info.component';
import { UserInfoComponent } from './account/user-info/user-info.component';
import { ReviewComponent } from './account/review/review.component';
import { AccountHomeComponent } from './account/account-home/account-home.component';
import { DatePipe } from '@angular/common';
import { DietViewComponent } from './account/diet-history/views/diet-view/diet-view.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { RedirectComponent } from './overlays/redirect/redirect.component';
import { AlertComponent } from './overlays/alert/alert.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrivacyComponent } from './footer/policies/privacy/privacy.component';
import { TermsAndConditionsComponent } from './footer/policies/terms-and-conditions/terms-and-conditions.component';
import { CookiesComponent } from './footer/policies/cookies/cookies.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DietComponent,
    LoginComponent,
    SignupComponent,
    BaseComponent,
    FooterComponent,
    AddMealComponent,
    FinalDietComponent,
    GroceriesComponent,
    FinishedComponent,
    DietHistoryComponent,
    BodyInfoComponent,
    UserInfoComponent,
    ReviewComponent,
    AccountHomeComponent,
    DietViewComponent,
    SpinnerComponent,
    RedirectComponent,
    AlertComponent,
    PrivacyComponent,
    TermsAndConditionsComponent,
    CookiesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    OverlayModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ImageCropperModule,
    BrowserAnimationsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
