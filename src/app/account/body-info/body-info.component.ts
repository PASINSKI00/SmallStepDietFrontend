import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BodyInfoService } from './body-info.service';

@Component({
  selector: 'app-body-info',
  templateUrl: './body-info.component.html',
  styleUrls: ['./body-info.component.sass']
})
export class BodyInfoComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private bodyInfoService: BodyInfoService) { }

  ngOnInit(): void {
    this.bodyInfoService.getBodyInfo().subscribe(response => {
      this.bodyInfoForm.patchValue(JSON.parse(response.body));
    });
  }

  bodyInfoForm = this.formBuilder.group({
    goal: 'LOSE_WEIGHT',
    height: new FormControl('', [Validators.required]),
    weight: new FormControl('', [Validators.required]),
    age: new FormControl('', [Validators.required]),
    pal: new FormControl('', [Validators.required, Validators.min(1.4), Validators.max(2.4)]),
  });

  onSubmit() {
    this.bodyInfoService.saveBodyInfo(this.bodyInfoForm).subscribe(response => {
      if(response.status != 201) {
        alert('Error');
        console.log(response);
      }
    });
  }


}
