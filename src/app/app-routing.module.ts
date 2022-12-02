import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DietComponent } from './diet/diet.component';
import { WallComponent } from './wall/wall.component';
import { AddMealComponent } from './add-meal/add-meal.component';

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
    path: 'wall',
    component: WallComponent,
  },
  {
    path: 'addMeal',
    component: AddMealComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
