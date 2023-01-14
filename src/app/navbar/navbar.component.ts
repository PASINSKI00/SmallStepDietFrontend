import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {
  @Output() accessEvent = new EventEmitter<string>();
  active: string = '';
  isLoggedIn: boolean = false;

  constructor(private sharedService: SharedService) { 
    this.active = window.location.pathname.split('/')[1];
    if (this.active == '' || this.active == 'addMeal') {
      this.active = 'home';
    }
  }

  ngOnInit(): void {
    this.sharedService.changeEmitted$.subscribe(
      (change) => {
        this.isLoggedIn = change;
      }
    );
  }

  access() {
    this.accessEvent.next('access');
  }
}
