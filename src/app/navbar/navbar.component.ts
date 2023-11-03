import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { NavigationEnd, Router } from '@angular/router';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { slideFromTop } from '../animations';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass'],
  animations: [
    slideFromTop
  ]
})
export class NavbarComponent implements OnInit {
  active: string = '';
  isLoggedIn: boolean = false;
  hamburger = faBars;
  showMenu = true;

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
