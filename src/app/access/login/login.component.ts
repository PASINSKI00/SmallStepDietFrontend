import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { SharedService } from 'src/app/shared.service';
import { AccessService } from '../access.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  message: string = 'Sign in to Your Account';
  loginFailed: boolean = false;
  loginSuccessfull: boolean = false;

  loginForm = this.formBuilder.group({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private _sharedService: SharedService, private accessService: AccessService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  login() {
    this.accessService.login(this.loginForm).subscribe(
      (response) => {
        this.loginFailed = false;
        this.loginSuccessfull = true;
        this.message = 'Login successful. Welcome!';
        setTimeout(() => {
          this._sharedService.emitChange('closeAccess');
        }, 2000);
      },
      (error) => {
        this._sharedService.deleteAuthHeaderValue();
        this.loginFailed = true;
        this.loginSuccessfull = false;
        this.message = 'Bad email or password. Please try again.';
      }
    );
  }

  signup() {
    this._sharedService.emitChange('signup');
  }
}
