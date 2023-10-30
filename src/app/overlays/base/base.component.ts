import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.sass'],
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0, transform: 'translateY(10px)' })),
      ]),
    ])
  ]
})
export class BaseComponent implements OnInit {  
  shouldShowOverlaySubContent: boolean = false;

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
