import { Component } from '@angular/core';
import { RedirectDetails } from './redirect-details';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.sass']
})
export class RedirectComponent {
  message: string = '';
  url: string = '';

  constructor(redirectDetails: RedirectDetails, private router: Router, private sharedService: SharedService) {
    this.message = redirectDetails.message;
    this.url = redirectDetails.url;
  }

  ngOnInit(): void {
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

  close() {
    this.sharedService.emitChange('closeOverlay');
  }
}
