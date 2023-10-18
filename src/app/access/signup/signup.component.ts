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
  readonly defaultMessage: string = 'Create a new account';
  readonly signUpSuccessMessage: string = 'Account created! You can Log in now!';
  readonly signUpFailureMessage: string = 'Something went wrong. Please try again.';
  readonly nameInvalidMessage: string = 'Name is required';
  readonly emailTakenMessage: string = 'Email already in use';
  readonly emailInvalidMessage: string = 'Email is invalid. Try something similar to: john.smith@gmail.com';
  readonly passwordInvalidMessage: string = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number';
  readonly passwordsDontMatchMessage: string = 'Passwords do not match';
  message: string = this.defaultMessage;
  signUpFailed: boolean = false;
  signUpSuccessfull: boolean = false;
  passwordsMatch: boolean = false;
  isLoading: boolean = false;

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
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$')]),
    repassword: new FormControl('', [Validators.required]),
  }, { validators: this.passwordMatchValidator });

  ngOnInit(): void {
  }

  signup() {
    if (!this.goodInputOrFeedback()) {
      return;
    }
    this.isLoading = true;
    this.accessService.signup(this.signupForm).subscribe(
      (response) => {
        this.signUpFailed = false;
        this.signUpSuccessfull = true;
        this.message = this.signUpSuccessMessage;
        this.isLoading = false;
        setTimeout(() => {
          this._sharedService.emitChange('loginOverlay');
        }
        , 2000);
      },
      (error) => {
        if(error.status == 409) 
          this.message = this.emailTakenMessage;
        
        if(error.status == 400 && error.error.message)
          this.message = error.error.message;

        this.signUpFailed = true;
        this.signUpSuccessfull = false;
        this.isLoading = false;
      }
    );
  }

  login() {
    this._sharedService.emitChange('loginOverlay');
  }

  private goodInputOrFeedback(): boolean {
    if(this.signupForm.valid) {
      return true;
    }

    const name = this.signupForm.controls.name;
    const email = this.signupForm.controls.email;
    const password = this.signupForm.controls.password;
    const repassword = this.signupForm.controls.repassword;

    if(name.invalid) {
      this.message = this.nameInvalidMessage;
      name.markAsTouched();
    } else if(email.invalid) {
      this.message = this.emailInvalidMessage;
      email.markAsTouched();
    } else if(password.invalid) {
      this.message = this.passwordInvalidMessage;
      password.markAsTouched();
    } else if(repassword.invalid) {
      this.message = this.passwordsDontMatchMessage;
      repassword.markAsTouched();
    } else {
      this.message = this.signUpFailureMessage;
    }

    this.signUpFailed = true;
    this.signUpSuccessfull = false;
    return false;
  }
}
