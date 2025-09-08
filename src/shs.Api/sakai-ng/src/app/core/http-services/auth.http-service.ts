import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential
} from 'firebase/auth';
import { auth } from '../firebase.config';

export interface LoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string | null;
  twoFactorRecoveryCode?: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
  // Add other user properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {
    private apiUrl = environment.apiUrl;
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    private isLoadingSubject = new BehaviorSubject<boolean>(false);

    // Public observables
    public currentUser$ = this.currentUserSubject.asObservable();
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    public isLoading$ = this.isLoadingSubject.asObservable();

    constructor(private http: HttpClient) {
      // Listen to Firebase auth state changes
      onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          // User is signed in
          const user: User = this.mapFirebaseUserToUser(firebaseUser);
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        } else {
          // User is signed out
          this.currentUserSubject.next(null);
          this.isAuthenticatedSubject.next(false);
        }
      });
    }

    /**
     * Login user with email and password using Firebase
     */
    login(loginData: LoginRequest): Observable<boolean> {
      this.isLoadingSubject.next(true);

      return new Observable<boolean>(observer => {
        signInWithEmailAndPassword(auth, loginData.email, loginData.password)
          .then((userCredential: UserCredential) => {
            // Firebase handles the auth state change automatically
            this.isLoadingSubject.next(false);
            observer.next(true);
            observer.complete();
          })
          .catch((error: any) => {
            this.isLoadingSubject.next(false);
            observer.error(this.handleFirebaseError(error));
          });
      });
    }

    /**
     * Logout user using Firebase
     */
    logout(): Observable<boolean> {
      this.isLoadingSubject.next(true);

      return new Observable<boolean>(observer => {
        signOut(auth)
          .then(() => {
            // Firebase handles the auth state change automatically
            this.isLoadingSubject.next(false);
            observer.next(true);
            observer.complete();
          })
          .catch((error: any) => {
            // Even if logout fails, clear local state
            this.currentUserSubject.next(null);
            this.isAuthenticatedSubject.next(false);
            this.isLoadingSubject.next(false);
            observer.next(true);
            observer.complete();
          });
      });
    }

    /**
     * Get current user information from Firebase
     */
    getCurrentUser(): Observable<User | null> {
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        const user = this.mapFirebaseUserToUser(firebaseUser);
        return of(user);
      } else {
        return of(null);
      }
    }

    /**
     * Check authentication status - Firebase handles this automatically
     */
    checkAuthStatus(): void {
      // Firebase auth state is automatically managed by onAuthStateChanged
      // This method is kept for compatibility but doesn't need to do anything
    }

    /**
     * Check if user has specific role
     */
    hasRole(role: string): boolean {
      const user = this.currentUserSubject.value;
      return user ? user.roles.includes(role) : false;
    }

    /**
     * Check if user has any of the specified roles
     */
    hasAnyRole(roles: string[]): boolean {
      const user = this.currentUserSubject.value;
      return user ? roles.some(role => user.roles.includes(role)) : false;
    }

    /**
     * Get current user value (synchronous)
     */
    get currentUserValue(): User | null {
      return this.currentUserSubject.value;
    }

    /**
     * Get authentication status (synchronous)
     */
    get isAuthenticated(): boolean {
      return this.isAuthenticatedSubject.value;
    }

    /**
     * Map Firebase user to our User interface
     */
    private mapFirebaseUserToUser(firebaseUser: FirebaseUser): User {
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email || '',
        displayName: firebaseUser.displayName || undefined,
        photoURL: firebaseUser.photoURL || undefined,
        emailVerified: firebaseUser.emailVerified,
        roles: ['user'] // Default role, you can customize this based on your needs
      };
    }

    /**
     * Handle Firebase authentication errors
     */
    private handleFirebaseError(error: any): Error {
      let errorMessage = 'An unknown error occurred';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No user found with this email address';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This user account has been disabled';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        default:
          errorMessage = error.message || 'Authentication failed';
      }

      return new Error(errorMessage);
    }

    /**
     * Register a new user with Firebase
     */
    register(email: string, password: string, displayName?: string): Observable<boolean> {
      this.isLoadingSubject.next(true);

      return new Observable<boolean>(observer => {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential: UserCredential) => {
            // Update the user's display name if provided
            if (displayName && userCredential.user) {
              updateProfile(userCredential.user, { displayName });
            }
            this.isLoadingSubject.next(false);
            observer.next(true);
            observer.complete();
          })
          .catch((error: any) => {
            this.isLoadingSubject.next(false);
            observer.error(this.handleFirebaseError(error));
          });
      });
    }

    /**
     * Send password reset email
     */
    resetPassword(email: string): Observable<boolean> {
      this.isLoadingSubject.next(true);

      return new Observable<boolean>(observer => {
        sendPasswordResetEmail(auth, email)
          .then(() => {
            this.isLoadingSubject.next(false);
            observer.next(true);
            observer.complete();
          })
          .catch((error: any) => {
            this.isLoadingSubject.next(false);
            observer.error(this.handleFirebaseError(error));
          });
      });
    }

    private handleError(error: HttpErrorResponse) {
      let errorMessage = 'An unknown error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error.error.message;
      } else {
        // Server-side error
        switch (error.status) {
          case 401:
            errorMessage = 'Invalid credentials';
            break;
          case 403:
            errorMessage = 'Access forbidden';
            break;
          case 422:
            errorMessage = 'Validation error';
            break;
          default:
            errorMessage = `Server error: ${error.status}`;
        }
      }

      return throwError(() => new Error(errorMessage));
    }
}
