import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account-service';

export const preventSelfMessageGuard: CanActivateFn = (route) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const memberId = route.parent?.paramMap.get('id');

  if (memberId && memberId === accountService.currentUser()?.id) {
    return router.createUrlTree(['/members', memberId, 'profile']);
  }

  return true;
};
