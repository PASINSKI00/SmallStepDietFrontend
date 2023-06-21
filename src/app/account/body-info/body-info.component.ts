import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { BodyInfoService } from './body-info.service';

@Component({
  selector: 'app-body-info',
  templateUrl: './body-info.component.html',
  styleUrls: ['./body-info.component.sass']
})
export class BodyInfoComponent implements OnInit {
  BEE: number = 0;
  TDEE: number = 0;
  caloriesGoal: number = 0;
  

  constructor(private formBuilder: FormBuilder, private bodyInfoService: BodyInfoService) { }

  ngOnInit(): void {
    this.getBodyInfo();
  }

  bodyInfoForm = this.formBuilder.group({
    goal: new FormControl('LOSE_WEIGHT', [Validators.required]),
    gender: new FormControl('MALE', [Validators.required]),
    height: new FormControl('', [Validators.required]),
    weight: new FormControl('', [Validators.required]),
    age: new FormControl('', [Validators.required]),
    pal: new FormControl('', [Validators.required, Validators.min(1.4), Validators.max(2.4)]),
    additionalCalories: 0
  });

  async getBodyInfo() {
    const response$ = this.bodyInfoService.getBodyInfo();
    const lastValue$ = await lastValueFrom(response$);

    let result = JSON.parse(lastValue$.body);
    
    this.bodyInfoForm.patchValue({
      goal: result.goal,
      gender: result.gender,
      height: result.height,
      weight: result.weight,
      age: result.age,
      pal: result.pal,
      additionalCalories: result.additionalCalories
    });

    this.BEE = result.bee;
    this.TDEE = result.tdee;
    this.caloriesGoal = result.caloriesGoal;
  }

  async onSubmit() {
    this.bodyInfoService.saveBodyInfo(this.bodyInfoForm).subscribe(
      (response) => {
          this.getBodyInfo();
      },
      (error) => {
        alert('Error while saving. Please check the values and try again.');
        console.log(error);
      }
    );
  }
}
