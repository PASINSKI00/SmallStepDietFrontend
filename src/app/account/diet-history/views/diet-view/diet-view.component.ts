import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DietService } from 'src/app/diet/diet.service';
import { lastValueFrom } from 'rxjs';
import { FinalDiet } from 'src/app/diet/final-diet/final-diet';

@Component({
  selector: 'app-diet-view',
  templateUrl: './diet-view.component.html',
  styleUrls: ['./diet-view.component.sass']
})
export class DietViewComponent {
  finalDiet: FinalDiet = null!;

  constructor(private route: ActivatedRoute, private dietService: DietService) {
    this.route.params.subscribe( params => 
      {
        lastValueFrom(this.dietService.getDiet(params['id']))
          .then((response) => {
            this.finalDiet = JSON.parse(response.body);
          }).catch(() => {
            alert("Something went wrong");
          });          
      }
    );
  }  
}
