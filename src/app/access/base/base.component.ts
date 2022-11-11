import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.sass']
})
export class BaseComponent implements OnInit {
  @Output() closeAccessEvent = new EventEmitter<string>();

  constructor(private _sharedService: SharedService) { }

  ngOnInit(): void {
  }

  closeAccess(){
    this._sharedService.emitChange('closeAccess');
  }
}
