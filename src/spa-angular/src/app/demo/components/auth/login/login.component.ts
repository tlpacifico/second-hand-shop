import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { IdentityDataService } from '../../../../infrastructure/data-services/identity-data.serives';
import { Router } from '@angular/router';
import { co } from '@fullcalendar/core/internal-common';
import { switchMap } from 'rxjs';
import { AuthService } from '../../../../infrastructure/auth/auth.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {
    public email: string;

    constructor(public identityDataService: IdentityDataService,
        public layoutService: LayoutService,
        public authService: AuthService,
        public router: Router
    ) {

    }
    public login(): void {
        this.identityDataService.login({
            email: this.email,
            password: this.password
        }).pipe(
            switchMap(() => this.identityDataService.me())
        ).subscribe(me => {
            this.authService.loggedUser = me;
            this.router.navigate(['/']);
        });
    }

    valCheck: string[] = ['remember'];

    password!: string;


}
