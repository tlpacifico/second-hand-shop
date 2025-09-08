import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PageWithTotalOfConsignmentSupplierResponse,
  ConsignmentSupplierResponse,
  CreateConsignmentSupplierRequest,
  UpdateConsignmentSupplierRequest,
  ConsignmentSupplierEntity,
  PaginationParams
} from '../models/api.models';

@Injectable({providedIn: 'root'})
export class SupplierHttpService {
    private uri: string;

    constructor(private http: HttpClient) {
        this.uri = `${environment.apiUrl}/api/suppliers`;
    }

    /**
     * Get paginated list of suppliers
     * @param params Pagination parameters (Skip and Take)
     * @returns Observable of paginated supplier response
     */
    getSuppliers(params: PaginationParams): Observable<PageWithTotalOfConsignmentSupplierResponse> {
        const httpParams = new HttpParams()
            .set('Skip', params.Skip.toString())
            .set('Take', params.Take.toString());

        return this.http.get<PageWithTotalOfConsignmentSupplierResponse>(this.uri, { params: httpParams });
    }

    /**
     * Get all suppliers without pagination
     * @returns Observable of array of supplier responses
     */
    getAllSuppliers(): Observable<ConsignmentSupplierResponse[]> {
        return this.http.get<ConsignmentSupplierResponse[]>(`${this.uri}/all`);
    }

    /**
     * Get a specific supplier by ID
     * @param id Supplier ID
     * @returns Observable of supplier response
     */
    getSupplierById(id: number): Observable<ConsignmentSupplierResponse> {
        return this.http.get<ConsignmentSupplierResponse>(`${this.uri}/${id}`);
    }

    /**
     * Create a new supplier
     * @param supplier Supplier creation request
     * @returns Observable of created supplier response
     */
    createSupplier(supplier: CreateConsignmentSupplierRequest): Observable<ConsignmentSupplierResponse> {
        return this.http.post<ConsignmentSupplierResponse>(this.uri, supplier);
    }

    /**
     * Update an existing supplier
     * @param id Supplier ID
     * @param supplier Supplier update request
     * @returns Observable of updated supplier response
     */
    updateSupplier(id: number, supplier: UpdateConsignmentSupplierRequest): Observable<ConsignmentSupplierResponse> {
        return this.http.put<ConsignmentSupplierResponse>(`${this.uri}/${id}`, supplier);
    }

    /**
     * Delete a supplier
     * @param id Supplier ID
     * @returns Observable of void (204 No Content)
     */
    deleteSupplier(id: number): Observable<void> {
        return this.http.delete<void>(`${this.uri}/${id}`);
    }
}
