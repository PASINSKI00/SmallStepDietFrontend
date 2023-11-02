import { animate, style, transition, trigger } from "@angular/animations";

export const slideFromTop = trigger('slideFromTop', [
    transition(':enter', [
      style({ transform: 'translateY(-100%)' }), // Start position (off-screen)
      animate('300ms ease-in', style({ transform: 'translateY(0)' })), // End position (on-screen)
    ]),
    transition(':leave', [
      style({ transform: 'translateY(0)' }), // Start position (on-screen)
      animate('300ms ease-out', style({ transform: 'translateY(-100%)' })), // End position (off-screen)
    ]),
  ]);

export const fadeSlideInOut = trigger('fadeSlideInOut', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(10px)' }),
      animate('400ms', style({ opacity: 1, transform: 'translateY(0)' })),
    ]),
    transition(':leave', [
      animate('200ms', style({ opacity: 0, transform: 'translateY(10px)' })),
    ]),
  ]);
