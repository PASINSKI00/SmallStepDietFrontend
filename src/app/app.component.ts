import { Component } from '@angular/core';
import { LoginComponent } from "./overlays/login/login.component";
import { SignupComponent } from "./overlays/signup/signup.component";
import { SharedService } from './shared.service';
import { RedirectDetails } from './overlays/redirect/redirect-details';
import { RedirectComponent } from './overlays/redirect/redirect.component';
import { AlertDetails } from './overlays/alert/alert-details';
import { AlertComponent } from './overlays/alert/alert.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'frontend';

  constructor(private sharedService: SharedService) {
    sharedService.changeEmitted$.subscribe( change => {
      if(change == 'closeOverlay')
        this.sharedService.closeOverlay();
      else if(change == 'loginOverlay')
        this.sharedService.showOverlay(LoginComponent)
      else if(change == 'signupOverlay')
        this.sharedService.showOverlay(SignupComponent)
      else if(change instanceof RedirectDetails)
        this.sharedService.showOverlay(RedirectComponent, change, RedirectDetails)
      else if(change instanceof AlertDetails)
        this.sharedService.showOverlay(AlertComponent, change, AlertDetails)
      });
   }
}
