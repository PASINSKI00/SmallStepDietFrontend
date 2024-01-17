import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { BodyInfoService } from './body-info.service';
import { SharedService } from 'src/app/shared.service';
import { RedirectDetails } from 'src/app/overlays/redirect/redirect-details';
import { AlertDetails } from 'src/app/overlays/alert/alert-details';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-body-info',
  templateUrl: './body-info.component.html',
  styleUrls: ['./body-info.component.sass']
})
export class BodyInfoComponent implements OnInit {
  BEE: number = 0;
  TDEE: number = 0;
  caloriesGoal: number = 0;
  isLoading: boolean = false;
  firstTimer: boolean = false;
  overlayActive: boolean = false;

  constructor(private formBuilder: FormBuilder, private bodyInfoService: BodyInfoService, private sharedService: SharedService,
    private router: Router) { }

  ngOnInit(): void {
    const currentPath = this.router.url;
    if(currentPath.includes('diet')) {
      this.overlayActive = true;
      this.bodyInfoForm.setValue(this.sharedService.readBodyInfoForm());
    }
    else{
      this.getBodyInfo();
    }
  }

  bodyInfoForm = this.formBuilder.group({
    goal: new FormControl('LOSE_WEIGHT', [Validators.required]),
    gender: new FormControl('MALE', [Validators.required]),
    height: new FormControl(undefined, [Validators.required]),
    weight: new FormControl(undefined, [Validators.required]),
    age: new FormControl(undefined, [Validators.required, Validators.min(16)]),
    pal: new FormControl<number>(1.4, [Validators.required, Validators.min(1.4), Validators.max(2.5)]),
    additionalCalories: 0
  });

  async getBodyInfo() {
    await lastValueFrom(this.bodyInfoService.getBodyInfo()).then((response) => {
      const result = JSON.parse(response.body);
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
    }).catch((error) => {
      if(error.status == 404) {
        this.firstTimer = true;
      }
    });
  }

  async onSubmit() {
    if(this.sharedService.isLoggedIn() == false){
      this.sharedService.saveBodyInfoForm(this.bodyInfoForm);
      this.sharedService.emitChange('closeOverlay');
      return;
    }

    this.isLoading = true;
    this.bodyInfoService.saveBodyInfo(this.bodyInfoForm).subscribe(
      (response) => {
          this.getBodyInfo();
          this.isLoading = false;

          if(this.firstTimer) {
            this.firstTimer = false;
            const redirectDetails = new RedirectDetails("Now that we know Your Calories Goal, You can go ahead and finish Your diet","/diet")
            this.sharedService.emitChange(redirectDetails);
          }
      },
      (error) => {
        const alertDetails = new AlertDetails("Error while saving. Please check the values and try again.");
        this.sharedService.emitChange(alertDetails);
        this.isLoading = false;
      }
    );
  }
}
