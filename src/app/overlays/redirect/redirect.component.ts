import { Component } from '@angular/core';
import { RedirectDetails } from './redirect-details';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.sass']
})
export class RedirectComponent extends BaseComponent {
  message: string = '';
  url: string = '';
  continueOnly: boolean;

  constructor(redirectDetails: RedirectDetails, private router: Router, sharedService: SharedService) {
    super(sharedService);
    this.message = redirectDetails.message;
    this.url = redirectDetails.url;
    this.continueOnly = redirectDetails.continueOnly;
  }

  redirect() {
    if(this.url == 'login'){
      this.sharedService.emitChange('loginOverlay')
    }
    else if(this.url == 'signup') {
      this.sharedService.emitChange('signupOverlay')
    }
    else {
      this.router.navigate([this.url]);
      this.sharedService.emitChange('closeOverlay');
    }
  }
}
