import { Component, OnInit } from '@angular/core';
import { FinalDiet } from '../../diet/final-diet/final-diet';
import { DietService } from '../../diet/diet.service';

@Component({
  selector: 'app-diet-history',
  templateUrl: './diet-history.component.html',
  styleUrls: ['./diet-history.component.sass']
})
export class DietHistoryComponent implements OnInit {
  diets: FinalDiet[] = null!;

  constructor(private dietService: DietService) {
    this.dietService.getMyDiets().subscribe((response) => {
      if(response.status != 200) {
        alert("Something went wrong");
        return;
      }

      this.diets = JSON.parse(response.body);
      console.log(this.diets);
    });
  }

  ngOnInit(): void {
  }

}
