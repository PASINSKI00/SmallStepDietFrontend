import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  constructor(private _sharedService: SharedService) { }

  ngOnInit(): void {
  }

  login() {
    console.log('login');
  }

  signup() {
    console.log('signup');
    this._sharedService.emitChange('signup');
  }
}
