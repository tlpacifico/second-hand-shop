import { inject } from '@angular/core';
import { CanActivateFn, Router} from '@angular/router';
import { filter, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isLoggedIn$().pipe(
    tap(isLoggedIn => {
      if (!isLoggedIn) { router.navigate(['/login']); }
    })
  );

};
