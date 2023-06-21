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
    path: 'addMeal',
    component: AddMealComponent,
  },
  {
    path: 'diet/final',
    component: FinalDietComponent,
  },
  {
    path: 'diet/final/groceries',
    component: GroceriesComponent,
  },
  {
    path: 'diet/finished',
    component: FinishedComponent,
  },
  {
    path: 'account',
    component: AccountHomeComponent,
    children: [
      {
        path: 'user',
        component: UserInfoComponent,
      },
      {
        path: 'diets',
        component: DietHistoryComponent,
      },
      {
        path: 'bodyinfo',
        component: BodyInfoComponent,
      },
      {
        path: 'reviews',
        component: ReviewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
