import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SharedService } from 'src/app/shared.service';
import { AccessService } from '../access.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  constructor(private _sharedService: SharedService, private accessService: AccessService, private formBuilder: FormBuilder) { }

  loginForm = this.formBuilder.group({
    email: '',
    password: ''
  });

  ngOnInit(): void {
  }

  login() {
    this.accessService.login(this.loginForm).subscribe(
      (response) => {
        console.log(response.status);
        // this._sharedService.setToken(response.headers.get('Authorization'));
        // this._sharedService.setLoggedIn(true);
      }
    );
  }

  signup() {
    console.log('signup');
    this._sharedService.emitChange('signup');
  }
}
