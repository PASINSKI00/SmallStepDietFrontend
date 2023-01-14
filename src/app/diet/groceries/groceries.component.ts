import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../ingredient';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { DietService } from '../diet.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-groceries',
  templateUrl: './groceries.component.html',
  styleUrls: ['./groceries.component.sass']
})
export class GroceriesComponent implements OnInit {
  deleteIcon = faTrashAlt;
  ingredients: Array<Ingredient> = [];

  constructor(private dietService: DietService) { }

  ngOnInit(): void {
    this.getGroceries();
  }

  async getGroceries() {
    const response$ = this.dietService.getGroceries();
    const lastValue$ = await lastValueFrom(response$);
    if(lastValue$.status != 200) {
      alert("Something went wrong");
      return;
    }

    this.ingredients = JSON.parse(lastValue$.body);
  }

}
