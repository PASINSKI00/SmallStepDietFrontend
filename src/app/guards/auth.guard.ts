import { CanActivateFn } from '@angular/router';
import { SharedService } from '../shared.service';
import { inject } from '@angular/core';
import { AlertDetails } from '../overlays/alert/alert-details';

export const authGuard: CanActivateFn = (route, state) => {
  const sharedService = inject(SharedService)

  if(sharedService.isLoggedIn()) {
    return true;
  }

  const alert = new AlertDetails("You need to be logged in to access this part of the website");
  sharedService.emitChange(alert);
  return false;
};
