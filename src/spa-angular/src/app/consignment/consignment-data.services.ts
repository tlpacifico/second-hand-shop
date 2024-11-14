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

    public getSuppliers(): Observable<ConsignmentSupplierModel[]> {
        return this.httpClient.get<ConsignmentSupplierModel[]>(`${this.uri}/suppliers`);
    }

    public createSupplier(supplier: CreateConsignmentSupplierModel): Observable<{}> {
        return this.httpClient.post(`${this.uri}/suppliers`, supplier);
    }

}

export interface ConsignmentSupplierModel {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    address?: string;
}
export interface CreateConsignmentSupplierModel {
    name: string;
    email: string;
    phoneNumber: string;
    address?: string;
}
