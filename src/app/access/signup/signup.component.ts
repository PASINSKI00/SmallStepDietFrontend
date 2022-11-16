import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';
import { FormBuilder } from '@angular/forms';
import { AccessService } from '../access.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass']
})
export class SignupComponent implements OnInit {

  constructor(private _sharedService: SharedService, private accessService: AccessService, private formBuilder: FormBuilder) { }

  signupForm = this.formBuilder.group({
    name: '',
    email: '',
    password: ''
  });

  ngOnInit(): void {
  }

  signup() {
    console.log('signup');
    this.accessService.signup(this.signupForm).subscribe(
      (response) => {
        console.log(response);
      }
    );
  }

  login() {
    console.log('login');
    this._sharedService.emitChange('login');
  }
}
