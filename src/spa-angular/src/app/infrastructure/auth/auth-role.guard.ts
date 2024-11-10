import { CanActivateFn, Router } from '@angular/router';
import { AuthService, Enum } from './auth.service';
import { inject } from '@angular/core';

export const authRoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let roles = route.data["roles"] as Array<Enum<string>>;
  const hasAnyRole = roles.map(role => authService.identityProvider.isInRole(role.toString()))
  .some(p => p === true);
  if (hasAnyRole) {
    return true;
  }
  // if(authService.hasUserRole())
  //   router.navigate(['user', 'dashboard-general'])
  // else
  //   router.navigate(['iue', 'search']);
  return false;
};
