import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AccessService } from '../access.service';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass']
})
export class SignupComponent implements OnInit {
  message: string = 'Create a new account';
  signUpFailed: boolean = false;
  signUpSuccessfull: boolean = false;
  passwordsMatch: boolean = false;

  constructor(private _sharedService: SharedService, private accessService: AccessService, private formBuilder: FormBuilder) { }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const repassword = control.get('repassword');
    const result = password && repassword && password.value === repassword.value ? null : { passwordMatch: true };
    
    if(result !== null) {
      this.passwordsMatch = true;
    } else {
      this.passwordsMatch = false;
    }
  
    return result;
  };

  signupForm = this.formBuilder.group({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    repassword: new FormControl('', [Validators.required]),
  }, { validators: this.passwordMatchValidator });

  ngOnInit(): void {
  }

  signup() {
    this.accessService.signup(this.signupForm).subscribe(
      (response) => {
        this.signUpFailed = false;
        this.signUpSuccessfull = true;
        this.message = 'Account created successfully! You can Log in now!';
        setTimeout(() => {
          this._sharedService.emitChange('login');
        }
        , 2000);
      },
      (error) => {
        if(error.status == 409) 
          this.message = 'Email already in use. Please try again.';
        
        if(error.status == 400 && error.error.message)
          this.message = error.error.message;

        this.signUpFailed = true;
        this.signUpSuccessfull = false;
      }
    );
  }

  login() {
    console.log('login');
    this._sharedService.emitChange('login');
  }
}
