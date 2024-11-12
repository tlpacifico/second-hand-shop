import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class ConsignmentService {

    private consigmentCache: Map<string, any> = new Map();

    private uri: string;
    constructor(private httpClient: HttpClient) {
        this.uri = `${environment.apiUrl}/api/consignments`;
    }

    public getSuppliers(): Observable<ConsignmentSupplierResponse[]> {
        return this.httpClient.get<ConsignmentSupplierResponse[]>(`${this.uri}/suppliers`);
    }

}

export interface ConsignmentSupplierResponse {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    address?: string;
}