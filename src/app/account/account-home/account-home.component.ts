import { Component, OnInit } from '@angular/core';
import { faUser, faStar } from '@fortawesome/free-regular-svg-icons';
import { faCalculator, faBook } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-account-home',
  templateUrl: './account-home.component.html',
  styleUrls: ['./account-home.component.sass']
})
export class AccountHomeComponent implements OnInit {
  userIcon = faUser;
  dietsIcon = faBook;
  bodyInfoIcon = faCalculator;
  reviewsIcon = faStar;
  activeLink = '';

  constructor() {
    this.checkActiveLink();
  }

  ngOnInit(): void {
  }

  checkActiveLink() {
    this.activeLink = window.location.pathname.split('/')[2];
  }
}
