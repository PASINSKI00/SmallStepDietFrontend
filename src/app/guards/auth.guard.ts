import { CanActivateFn } from '@angular/router';
import { SharedService } from '../shared.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const sharedService = inject(SharedService)
  return sharedService.isLoggedIn();
};
