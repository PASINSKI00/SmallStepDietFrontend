import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {
  active: string = 'home';

  constructor() { }

  ngOnInit(): void {
  }

  register() {
    console.log('register');
  }
}
