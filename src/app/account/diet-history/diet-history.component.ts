import { Component, OnInit } from '@angular/core';
import { FinalDiet } from '../../diet/final-diet/final-diet';
import { DietService } from '../../diet/diet.service';
import { lastValueFrom } from 'rxjs';
import { AlertDetails } from 'src/app/overlays/alert/alert-details';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-diet-history',
  templateUrl: './diet-history.component.html',
  styleUrls: ['./diet-history.component.sass']
})
export class DietHistoryComponent implements OnInit {
  diets: FinalDiet[] = null!;

  constructor(private dietService: DietService, private sharedService: SharedService) {
    this.dietService.getMyDiets().subscribe((response) => {
      if(response.status != 200) {
        const alertDetails = new AlertDetails("You have no diets yet. Refer to the diet page to create one.");
        this.sharedService.emitChange(alertDetails);
        return;
      }

      this.diets = JSON.parse(response.body);
      if(this.diets.length == 0) {
        const alertDetails = new AlertDetails("You have no diets yet. Refer to the diet page to create one.");
        this.sharedService.emitChange(alertDetails);
      }
    });
  }

  ngOnInit(): void {
  }

  downloadMyFile(fileUrl: string, number: number) {
    const now = new Date();
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', fileUrl);
    link.setAttribute('download', 'diet' + number + '_' + now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + '.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  chosenMealBackground(image: string) {
    return {
      'background-image': 'url(' + image + ')',
      'background-size': 'cover',
      'background-position': 'center'
    }
  }

  reCalculateDiet(idDiet: number) {
    lastValueFrom(this.dietService.reCalculateDiet(idDiet)).catch(() => {
      const alertDetails = new AlertDetails("Something went wrong");
      this.sharedService.emitChange(alertDetails);
    });
  }
}
