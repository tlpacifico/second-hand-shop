import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PageWithTotalOfConsignmentSearchResult,
  ConsignmentDetailResponse,
  ConsignmentItemResponse,
  CreateConsignmentRequest,
  UpdateConsignmentRequest,
  AddConsignmentItemRequest,
  UpdateConsignmentItemRequest,
  PaginationParams
} from '../models/api.models';

@Injectable({providedIn: 'root'})
export class ConsignmentHttpService {
    private uri: string;

    constructor(private http: HttpClient) {
        this.uri = `${environment.apiUrl}/api/consignments`;
    }

    /**
     * Get paginated list of consignments
     * @param params Pagination parameters (Skip and Take)
     * @returns Observable of paginated consignment search results
     */
    getConsignments(params: PaginationParams): Observable<PageWithTotalOfConsignmentSearchResult> {
        const httpParams = new HttpParams()
            .set('Skip', params.Skip.toString())
            .set('Take', params.Take.toString());

        return this.http.get<PageWithTotalOfConsignmentSearchResult>(this.uri, { params: httpParams });
    }

    /**
     * Get a specific consignment by ID with all details
     * @param id Consignment ID
     * @returns Observable of consignment detail response
     */
    getConsignmentById(id: number): Observable<ConsignmentDetailResponse> {
        return this.http.get<ConsignmentDetailResponse>(`${this.uri}/${id}`);
    }

    /**
     * Create a new consignment
     * @param consignment Consignment creation request
     * @returns Observable of created consignment detail response
     */
    createConsignment(consignment: CreateConsignmentRequest): Observable<ConsignmentDetailResponse> {
        return this.http.post<ConsignmentDetailResponse>(this.uri, consignment);
    }

    /**
     * Update an existing consignment
     * @param id Consignment ID
     * @param consignment Consignment update request
     * @returns Observable of void (202 Accepted)
     */
    updateConsignment(id: number, consignment: UpdateConsignmentRequest): Observable<void> {
        return this.http.put<void>(`${this.uri}/${id}`, consignment);
    }

    /**
     * Add an item to a consignment
     * @param consignmentId Consignment ID
     * @param item Item to add
     * @returns Observable of created consignment item response
     */
    addConsignmentItem(consignmentId: number, item: AddConsignmentItemRequest): Observable<ConsignmentItemResponse> {
        return this.http.post<ConsignmentItemResponse>(`${this.uri}/${consignmentId}/items`, item);
    }

    /**
     * Update a consignment item
     * @param consignmentId Consignment ID
     * @param itemId Item ID
     * @param item Updated item data
     * @returns Observable of void (204 No Content)
     */
    updateConsignmentItem(consignmentId: number, itemId: number, item: UpdateConsignmentItemRequest): Observable<void> {
        return this.http.put<void>(`${this.uri}/${consignmentId}/items/${itemId}`, item);
    }

    /**
     * Delete a consignment item
     * @param consignmentId Consignment ID
     * @param itemId Item ID
     * @returns Observable of void (204 No Content)
     */
    deleteConsignmentItem(consignmentId: number, itemId: number): Observable<void> {
        return this.http.delete<void>(`${this.uri}/${consignmentId}/items/${itemId}`);
    }
}
