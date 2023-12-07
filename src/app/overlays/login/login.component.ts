import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { SharedService } from 'src/app/shared.service';
import { AccessService } from '../access.service';
import { Buffer } from 'buffer';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent extends BaseComponent implements OnInit {
  readonly defaultMessage: string = 'Sign in to Your Account';
  readonly loginSuccessMessage: string = 'Login successful. Welcome!';
  readonly loginFailureMessage: string = 'Bad email or password. Please try again.';
  message: string = this.defaultMessage;
  loginFailed: boolean = false;
  loginSuccessfull: boolean = false;
  isLoading: boolean = false;

  loginForm = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$')])
  });

  constructor(private accessService: AccessService, private formBuilder: FormBuilder, sharedService: SharedService) {
    super(sharedService);
  }

  async login() {
    this.isLoading = true;

    await lastValueFrom(this.accessService.login(this.loginForm))
    .then(() => {
      var buf = Buffer.from(this.loginForm.value.email + ':' + this.loginForm.value.password);
      this.sharedService.setAuthHeaderValue('Basic ' + buf.toString('base64'));
      this.loginFailed = false;
      this.loginSuccessfull = true;
      this.message = this.loginSuccessMessage;
      setTimeout(() => {
        this.sharedService.emitChange('userLoggedIn');
        this.sharedService.emitChange('closeOverlay');
      }, 2000);
    }).catch(() => {
      this.loginFailed = true;
      this.loginSuccessfull = false;
      this.message = this.loginFailureMessage;
      this.sharedService.emitChange('userNotLoggedIn');
    });

    this.isLoading = false;
  }

  signup() {
    this.sharedService.emitChange('signupOverlay');
  }

  retryLogin() {
    this.loginFailed = false;
    this.loginSuccessfull = false;
    this.message = this.defaultMessage;
  }
}
