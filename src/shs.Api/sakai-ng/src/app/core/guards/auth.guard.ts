// auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { AuthHttpService } from '../http-services/auth.http-service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthHttpService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.checkAuth(state.url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.checkAuth(state.url);
  }

  private checkAuth(url: string): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (isAuthenticated) {
          return of(true);
        }

        // If not authenticated, try to get current user (in case session is still valid)
        return this.authService.getCurrentUser().pipe(
          map(user => {
            if (user) {
              return true;
            } else {
              // Redirect to login with return URL
              return this.router.createUrlTree(['/auth/login'], {
                queryParams: { returnUrl: url }
              });
            }
          })
        );
      })
    );
  }
}

// role.guard.ts - Guard for role-based authorization
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthHttpService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const requiredRoles = route.data['roles'] as string[];

    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          return this.router.createUrlTree(['/auth/login']);
        }

        if (requiredRoles && requiredRoles.length > 0) {
          const hasRole = requiredRoles.some(role => user.roles.includes(role));
          if (!hasRole) {
            return this.router.createUrlTree(['/unauthorized']);
          }
        }

        return true;
      })
    );
  }
}
