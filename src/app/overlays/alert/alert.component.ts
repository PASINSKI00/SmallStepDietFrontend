import { Component } from '@angular/core';
import { AlertDetails } from './alert-details';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.sass']
})
export class AlertComponent {
  message: string;

  constructor(alertDetails: AlertDetails, private sharedService: SharedService) {
    this.message = alertDetails.message;
  }

  close() {
    this.sharedService.emitChange('closeOverlay');
  }
}
