import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass']
})
export class SignupComponent implements OnInit {

  constructor(private _sharedService: SharedService) { }

  ngOnInit(): void {
  }

  signup() {
    console.log('signup');
  }

  login() {
    console.log('login');
    this._sharedService.emitChange('login');
  }
}
