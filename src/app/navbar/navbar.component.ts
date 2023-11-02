import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {
  active: string = '';
  isLoggedIn: boolean = false;

  constructor(private sharedService: SharedService, private router: Router) { }

  ngOnInit(): void {
    this.active = 'home';
    this.isLoggedIn = this.sharedService.isLoggedIn();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.active = event.url.split('/')[1]
      }
    })

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
}
