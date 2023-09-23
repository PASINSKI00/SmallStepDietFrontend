import { Component, ElementRef, OnInit } from '@angular/core';
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
  ingredients: Array<Array<Ingredient>> = [];
  numOfColumns: number = 3;
  elementesPerColumn: number = 0;

  constructor(private dietService: DietService, private elRef: ElementRef) { }

  ngOnInit(): void {
    this.getGroceries();
  }

  async getGroceries() {
    const observer$ = this.dietService.getGroceries();
    const lastValue$ = await lastValueFrom(observer$).catch(error => {
      alert("Something went wrong");
      console.log(error);
    });

    if(lastValue$ == undefined) {
      return;
    }

    let allIngredients: Array<Ingredient> = JSON.parse(lastValue$.body);

    if(allIngredients.length >= 6) {
      this.numOfColumns = 3;
    } else if(allIngredients.length >= 4) {
      this.numOfColumns = 2;
    } else {
      this.numOfColumns = 1;
    }

    this.elRef.nativeElement.style.setProperty('--num-of-columns', this.numOfColumns);
    this.elementesPerColumn = Math.ceil(allIngredients.length / this.numOfColumns);

    for(let i = 0; i < this.numOfColumns; i++) {
      this.ingredients.push(allIngredients.slice(i * this.elementesPerColumn, (i + 1) * this.elementesPerColumn));
    }
  }
}
