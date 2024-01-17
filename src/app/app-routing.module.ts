import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DietComponent } from './diet/diet.component';
import { AddMealComponent } from './add-meal/add-meal.component';
import { FinalDietComponent } from './diet/final-diet/final-diet.component';
import { GroceriesComponent } from './diet/groceries/groceries.component';
import { FinishedComponent } from './diet/finished/finished.component';
import { AccountHomeComponent } from './account/account-home/account-home.component';
import { UserInfoComponent } from './account/user-info/user-info.component';
import { DietHistoryComponent } from './account/diet-history/diet-history.component';
import { BodyInfoComponent } from './account/body-info/body-info.component';
import { ReviewComponent } from './account/review/review.component';
import { DietViewComponent } from './account/diet-history/views/diet-view/diet-view.component';
import { authGuard } from './guards/auth.guard';
import { PrivacyComponent } from './footer/policies/privacy/privacy.component';
import { CookiesComponent } from './footer/policies/cookies/cookies.component';
import { TermsAndConditionsComponent } from './footer/policies/terms-and-conditions/terms-and-conditions.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'diet',
    component: DietComponent,
  },
  {
    path: 'diet/meal/:id',
    component: DietComponent,
  },
  {
    path: 'addMeal',
    component: AddMealComponent,
  },
  {
    path: 'diet/final',
    component: FinalDietComponent
  },
  {
    path: 'diet/final/groceries',
    component: GroceriesComponent
  },
  {
    path: 'diet/final/groceries/:id',
    component: GroceriesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'diet/finished',
    component: FinishedComponent
  },
  {
    path: 'account',
    component: AccountHomeComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'user',
        component: UserInfoComponent,
        canActivate: [authGuard]
      },
      {
        path: 'diets',
        component: DietHistoryComponent,
        canActivate: [authGuard]
      },
      {
        path: 'bodyinfo',
        component: BodyInfoComponent,
        canActivate: [authGuard]
      },
      {
        path: 'reviews',
        component: ReviewComponent,
        canActivate: [authGuard]
      },
    ],
  },
  {
    path: 'diet/final/:id/view',
    component: DietViewComponent
  },
  {
    path: 'policies/privacy',
    component: PrivacyComponent
  },
  {
    path: 'policies/cookies',
    component: CookiesComponent
  },
  {
    path: 'policies/termsandconditions',
    component: TermsAndConditionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
