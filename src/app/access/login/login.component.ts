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

  loginForm = this.formBuilder.group({
    email: '',
    password: ''
  });

  constructor(private _sharedService: SharedService, private accessService: AccessService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  login() {
    this.accessService.login(this.loginForm).subscribe(
      (response) => {
        if(response.status == 200){
          alert('Login successful');
          this._sharedService.isLoggedIn = true;
        }
        else
          alert('Wrong email or password');
      }
    );
  }

  signup() {
    console.log('signup');
    this._sharedService.emitChange('signup');
  }
}
