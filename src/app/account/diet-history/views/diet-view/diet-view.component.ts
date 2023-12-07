import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DietService } from 'src/app/diet/diet.service';
import { lastValueFrom } from 'rxjs';
import { FinalDiet } from 'src/app/diet/final-diet/final-diet';
// @ts-ignore
import * as html2pdf from 'html2pdf.js';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-diet-view',
  templateUrl: './diet-view.component.html',
  styleUrls: ['./diet-view.component.sass']
})
export class DietViewComponent {
  finalDiet: FinalDiet = null!;

  constructor(private route: ActivatedRoute, private dietService: DietService, private datePipe: DatePipe) {
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

  async downloadPdf() {
    const timestamp = this.datePipe.transform(Date.now(), 'dd-MMM-yyyy');
    const content = document.getElementById('days-container');
    const options = {
      margin: 10,
      image: { type: 'jpeg', quality: 0.98 },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().from(content).set(options).save("Diet_" + timestamp + ".pdf");
  }
}
