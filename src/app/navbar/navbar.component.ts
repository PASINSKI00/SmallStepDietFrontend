import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {
  active: string = '';
  isLoggedIn: boolean = false;

  constructor(private sharedService: SharedService) { 
    this.setCorrectActive();
  }

  ngOnInit(): void {
    this.isLoggedIn = this.sharedService.isLoggedIn();
    
    this.sharedService.changeEmitted$.subscribe((change) => {
        if(change == 'userLoggedIn')
          this.isLoggedIn = true;
        else if(change == 'userNotLoggedIn')
          this.isLoggedIn = false;
      }
    );
  }

  access() {
    this.sharedService.emitChange('loginOverlay')
  }

  setCorrectActive() {
    this.active = window.location.pathname.split('/')[1];
    if (this.active == '' || this.active == 'addMeal') {
      this.active = 'home';
    }
  }
}
