import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {
  @Output() accessEvent = new EventEmitter<string>();
  active: string = 'home';

  constructor() { }

  ngOnInit(): void {
  }

  access() {
    this.accessEvent.next('access');
  }
}
