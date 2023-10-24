import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { SharedService } from 'src/app/shared.service';
import { AccessService } from '../access.service';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
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

  constructor(private _sharedService: SharedService, private accessService: AccessService, private formBuilder: FormBuilder,
    private sharedService: SharedService) { }

  ngOnInit(): void {
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
        this._sharedService.emitChange('userLoggedIn');
        this._sharedService.emitChange('closeOverlay');
      }, 2000);
    }).catch(() => {
      this.loginFailed = true;
      this.loginSuccessfull = false;
      this.message = this.loginFailureMessage;
      this._sharedService.emitChange('userNotLoggedIn');
    });

    this.isLoading = false;
  }

  signup() {
    this._sharedService.emitChange('signupOverlay');
  }

  retryLogin() {
    this.loginFailed = false;
    this.loginSuccessfull = false;
    this.message = this.defaultMessage;
  }
}
