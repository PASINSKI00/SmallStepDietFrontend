import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {
  @Output() accessEvent = new EventEmitter<string>();
  active: string = '';

  constructor(private router: Router) { 
    this.active = window.location.pathname.split('/')[1];
    if (this.active == '' || this.active == 'addMeal') {
      this.active = 'home';
    }
  }

  ngOnInit(): void {
  }

  access() {
    this.accessEvent.next('access');
  }
}
