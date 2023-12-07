import { Component, ElementRef, OnInit } from '@angular/core';
import { Ingredient } from '../ingredient';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { DietService } from '../diet.service';
import { lastValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
// @ts-ignore
import * as html2pdf from 'html2pdf.js';
import { DatePipe } from '@angular/common';
import { AlertDetails } from 'src/app/overlays/alert/alert-details';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-groceries',
  templateUrl: './groceries.component.html',
  styleUrls: ['./groceries.component.sass']
})
export class GroceriesComponent implements OnInit {
  deleteIcon = faTrashAlt;
  ingredients: Array<Array<Ingredient>> = [];
  numOfColumns: number = 2;
  elementesPerColumn: number = 0;
  cameFromDietHistory: boolean = false;

  isLoading: boolean = false;

  constructor(private dietService: DietService, private elRef: ElementRef, private route: ActivatedRoute, 
    private datePipe: DatePipe, private sharedService: SharedService) {
    this.route.params.subscribe( params => 
      {
        this.getGroceries(params['id']);       
      }
    );
  }

  ngOnInit(): void {}

  async getGroceries(id?: number) {
    this.isLoading = true;
    let observer$;
    if(id) {
      observer$ = this.dietService.getGroceriesById(id);
      this.cameFromDietHistory = true;
    } else {
      observer$ = this.dietService.getGroceries();
      this.cameFromDietHistory = false;
    }
    const lastValue$ = await lastValueFrom(observer$).catch(error => {
      const alertDetails = new AlertDetails("Something went wrong");
      this.sharedService.emitChange(alertDetails);
    });

    if(lastValue$ == undefined) {
      this.isLoading = false;
      return;
    }

    let allIngredients: Array<Ingredient> = JSON.parse(lastValue$.body);

    if(allIngredients.length >= 4) {
      this.numOfColumns = 2;
    } else {
      this.numOfColumns = 1;
    }

    this.elRef.nativeElement.style.setProperty('--num-of-columns', this.numOfColumns);
    this.elementesPerColumn = Math.ceil(allIngredients.length / this.numOfColumns);

    for(let i = 0; i < this.numOfColumns; i++) {
      this.ingredients.push(allIngredients.slice(i * this.elementesPerColumn, (i + 1) * this.elementesPerColumn));
    }

    this.isLoading = false;
  }

  async downloadPdf() {
    const timestamp = this.datePipe.transform(Date.now(), 'dd-MMM-yyyy');
    const content = document.getElementById('shopping-list');
    content?.style.setProperty('--num-of-columns', this.numOfColumns.toString());
    const options = {
      margin: 10,
      image: { type: 'jpeg', quality: 0.98 },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
    };
  
    html2pdf().from(content).set(options).save("Groceries_" + timestamp + ".pdf");
  }
}
