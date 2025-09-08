import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  BrandResponse,
  TagResponse
} from '../models/api.models';

@Injectable({providedIn: 'root'})
export class StoreHttpService {
    private uri: string;

    constructor(private http: HttpClient) {
        this.uri = `${environment.apiUrl}/api/store`;
    }

    /**
     * Get all available brands
     * @returns Observable of array of brand responses
     */
    getBrands(): Observable<BrandResponse[]> {
        return this.http.get<BrandResponse[]>(`${this.uri}/brands`);
    }

    /**
     * Get all available tags
     * @returns Observable of array of tag responses
     */
    getTags(): Observable<TagResponse[]> {
        return this.http.get<TagResponse[]>(`${this.uri}/tags`);
    }
}
