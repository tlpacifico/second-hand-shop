// auth.interceptor.ts
import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthHttpService } from '../http-services/auth.http-service';
import { environment } from '../../../environments/environment';
import { auth } from '../firebase.config';
import { getIdToken } from 'firebase/auth';

function handleUnauthorized(): void {
  const authService = inject(AuthHttpService);
  const router = inject(Router);

  // Clear user state
  authService.logout().subscribe(() => {
    // Redirect to login
    router.navigate(['/login'], {
      queryParams: { returnUrl: router.url }
    });
  });
}

function addTokenToRequest(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<any> {
  const currentUser = auth.currentUser;

  if (currentUser) {
    // Get the Firebase ID token
    return from(getIdToken(currentUser)).pipe(
      mergeMap((token) => {
        // Clone the request and add the authorization header
        const headers: { [key: string]: string } = {};
        if (!request.headers.has('Content-Type')) {
          headers['Content-Type'] = 'application/json';
        }
        headers['Authorization'] = `Bearer ${token}`;

        const authRequest = request.clone({
          setHeaders: headers
        });

        console.log('Interceptor request with token:', authRequest);
        return next(authRequest);
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('Interceptor error:', error);
        if (error.status === 401) {
          // Unauthorized - token might be invalid or expired
          handleUnauthorized();
        }
        return throwError(() => error);
      })
    );
  } else {
    // No user logged in, proceed without token
    const headers: { [key: string]: string } = {};
    if (!request.headers.has('Content-Type')) {
      headers['Content-Type'] = 'application/json';
    }

    const requestWithoutAuth = request.clone({
      setHeaders: headers
    });

    console.log('Interceptor request without token:', requestWithoutAuth);
    return next(requestWithoutAuth).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('Interceptor error:', error);
        if (error.status === 401) {
          handleUnauthorized();
        }
        return throwError(() => error);
      })
    );
  }
}

export function AuthInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<any> {
  const apiUrl = environment.apiUrl;

  // Only add Firebase token to requests to your API
  if (request.url.startsWith(apiUrl)) {
    return addTokenToRequest(request, next);
  }

  // For other requests, just pass them through
  return next(request);
}

// The interceptor is now registered in app.config.ts using withInterceptors()
