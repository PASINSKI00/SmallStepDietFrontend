import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../ingredient';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-groceries',
  templateUrl: './groceries.component.html',
  styleUrls: ['./groceries.component.sass']
})
export class GroceriesComponent implements OnInit {
  deleteIcon = faTrashAlt;
  ingredients: Array<Ingredient> = [];

  constructor() { }

  ngOnInit(): void {
    this.ingredients.push(new Ingredient(1, 'Apple'));
    this.ingredients.push(new Ingredient(2, 'Banana'));
    this.ingredients.push(new Ingredient(3, 'Orange'));
    this.ingredients[0].weight = 230;
    this.ingredients[1].weight = 320;
    this.ingredients[2].weight = 420;
  }

}
