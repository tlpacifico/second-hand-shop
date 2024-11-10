import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class IdentityDataService {
    private apiUrl = environment.apiUrl; // Replace with your API URL

    constructor(private http: HttpClient) {}

    login(model: {
        email: string,
        password: string
    }): Observable<Response> {
        return this.http.post<Response>(`${this.apiUrl}/login?useCookies=true`, model,
            {
                withCredentials: true
            }
        );
    }

    me(): Observable<UserModel> {
        return this.http.get<UserModel>(`${this.apiUrl}/api/user/me`,
            {
                withCredentials: true
            }
        );
    }
}

export interface UserModel {
    id: string;
    email: string;
    roles: string[];
}
