import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, from, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { IdentityProvider } from './identity-provider';
import { IdentityDataService } from '../data-services/identity-data.serives';


export class Enum<Any> {
    public constructor(public readonly value: any) { }
    public toString() {
        return this.value.toString();
    }
}
export enum RoleType {
    HcmAdmin = "hcm.admin",
    HcmHaulierAdmin = "hcm.haulier.admin",
    HcmHaulierUser = "hcm.haulier.user",
    HcmBcoAdmin = "hcm.bco.admin",
    HcmBcoUser = "hcm.bco.user"
}
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

    public loggedUser: {
        id: string,
        email: string,
        roles: string[]
    } | null = null;
    public userName: string | null = null;


    constructor(
        public identityProvider: IdentityProvider,
        public identityDataService: IdentityDataService,
    ) {

    }

    getCurrentUser(): Observable<{
        id: string,
        email: string,
        roles: string[]
    }> {
        if (this.loggedUser) {
            return of(this.loggedUser);
        } else {
            return this.identityDataService.me()
                .pipe(tap(user => this.loggedUser = user));
        }
    }

   public isLoggedIn$(): Observable<boolean> {
        return this.getCurrentUser().pipe(
          map(user => !!user),
          catchError(() => of(false))
        );

    }

    public hasAnyHCMRole(): boolean {
        const roles = Object.values(RoleType);
        return roles.map(role => this.identityProvider.isInRole(role))
            .some(p => p === true)
    }

    public hasCompanyAdminRole(): boolean {
        return this.hasBcoAdminRole() || this.hasHaulierAdminRole();
    }

    public hasCompanyUserRole(): boolean {
        return this.hasBcoUserRole() || this.hasHaulierUserRole();
    }

    public hasBcoRole(): boolean {
        return this.hasBcoAdminRole() || this.hasBcoUserRole();
    }

    public hasHaulierRole(): boolean {
        return this.hasHaulierAdminRole() || this.hasHaulierUserRole();
    }

    public hasHcmAdminRole(): boolean {
        return this.identityProvider.isInRole(RoleType.HcmAdmin)
    }

    public hasBcoAdminRole(): boolean {
        return this.identityProvider.isInRole(RoleType.HcmBcoAdmin)
    }

    public hasBcoUserRole(): boolean {
        return this.identityProvider.isInRole(RoleType.HcmBcoUser)
    }

    public hasHaulierAdminRole(): boolean {
        return this.identityProvider.isInRole(RoleType.HcmHaulierAdmin)
    }

    public hasHaulierUserRole(): boolean {
        return this.identityProvider.isInRole(RoleType.HcmHaulierUser)
    }
}
