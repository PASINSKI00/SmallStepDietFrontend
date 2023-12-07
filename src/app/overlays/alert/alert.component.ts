import { Component, Input } from '@angular/core';
import { AlertDetails } from './alert-details';
import { SharedService } from 'src/app/shared.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.sass']
})
export class AlertComponent extends BaseComponent {
  message: string;
  
  constructor(alertDetails: AlertDetails, sharedService: SharedService) {
    super(sharedService);
    this.message = alertDetails.message;
  }
}
