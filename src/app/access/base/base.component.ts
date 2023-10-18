import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.sass']
})
export class BaseComponent implements OnInit {
  constructor(private _sharedService: SharedService) { }

  ngOnInit(): void {
  }

  closeAccess(){
    this._sharedService.emitChange('closeAccess');
  }
}
