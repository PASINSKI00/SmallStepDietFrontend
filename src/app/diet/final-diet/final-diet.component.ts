import { Component, OnInit } from '@angular/core';
import { faAdd, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { DietService } from '../diet.service';
import { Meal } from '../meal';

@Component({
  selector: 'app-final-diet',
  templateUrl: './final-diet.component.html',
  styleUrls: ['./final-diet.component.sass']
})
export class FinalDietComponent implements OnInit {
  addIcon = faAdd;
  deleteIcon = faTrashAlt;
  diet: Array<Array<Meal>> = [];

  constructor(private dietService: DietService) { }

  ngOnInit(): void {
    this.diet = this.dietService.getDiet();
    console.log(this.diet);
  }
}
