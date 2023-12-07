import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';
import { fadeSlideInOut } from 'src/app/animations';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.sass'],
  animations: [
    fadeSlideInOut
  ]
})
export class BaseComponent implements OnInit {  
  shouldShowOverlaySubContent: boolean = false;
  xMark = faXmark;

  constructor(protected sharedService: SharedService) { }

  ngOnInit(): void {
    this.shouldShowOverlaySubContent = false;
    setTimeout(() => {
      this.shouldShowOverlaySubContent = true;
    }, 200)
  }

  close(){
    this.sharedService.closeOverlay();
  }
}
