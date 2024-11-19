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

    public getSupplierById(id: number): Observable<ConsignmentSupplierModel> {
        return this.httpClient.get<ConsignmentSupplierModel>(`${this.uri}/suppliers/${id}`);
    }

    public createSupplier(supplier: CreateConsignmentSupplierModel): Observable<{}> {
        return this.httpClient.post(`${this.uri}/suppliers`, supplier);
    }

    public create(consignment: CreateConsignmentModel): Observable<{}> {
        return this.httpClient.post(`${this.uri}`, consignment);
    }

    public getSupplierConsigned(supplierId: number) : Observable<ConsignmentModel[]> {
        return this.httpClient.get<ConsignmentModel[]>(`${this.uri}/suppliers/${supplierId}/consigned`);
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

export interface CreateConsignmentModel {
    supplierId: number;
    consignmentDate: Date;
    pickupDate: Date;
    items: CreateConsignmentItemModel[];
}

export interface CreateConsignmentItemModel {
    name: string;
    description: string;
    price: number;
}


export interface ConsignmentModel {
    id: number;
    supplier: ConsignmentSupplierModel;
    consignmentDate: Date;
    pickupDate?: Date;
    items: ConsignmentItemModel[];
}

export interface ConsignmentItemModel {
    id: number;
    name: string;
    description?: string;
    price: number;
}
