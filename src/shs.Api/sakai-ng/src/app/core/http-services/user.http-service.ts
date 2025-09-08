import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class UserHttpService {
    private uri: string;

    constructor(private http: HttpClient) {
        this.uri = `${environment.apiUrl}/api/user`;
    }

    /**
     * Get current user information
     * @returns Observable of user data (response type depends on API implementation)
     */
    getCurrentUser(): Observable<any> {
        return this.http.get(`${this.uri}/me`);
    }
}
