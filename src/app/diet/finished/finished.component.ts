import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-finished',
  templateUrl: './finished.component.html',
  styleUrls: ['./finished.component.sass']
})
export class FinishedComponent implements OnInit {
  isLoggedIn: boolean = false;
  idDiet: number = 0;

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.sharedService.isLoggedIn();
    this.idDiet = this.sharedService.getActiveDietId();
    this.sharedService.clearActiveDiet();
    this.sharedService.setShouldPromptBodyInfo(true);
  }
}
