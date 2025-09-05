/**
 * API Client Wrapper
 * 
 * This provides a convenient wrapper around the auto-generated API client
 * with authentication handling and common configuration.
 */

import { client as _heyApiClient } from './api-client/client.gen';
import type { Client } from './api-client/client';
import {
  // Authentication
  postLogin,
  postRegister,
  postRefresh,
  
  // Consignments
  getApiConsignments,
  postApiConsignments,
  getApiConsignmentsById,
  
  // Suppliers
  getApiSuppliers,
  postApiSuppliers,
  getApiSuppliersById,
  putApiSuppliersById,
  deleteApiSuppliersById,
  getApiSuppliersAll,
  
  // Store
  getApiStoreBrands,
  getApiStoreTags,
  
  // User
  getApiUserMe,
  
  // Types
  type AccessTokenResponse,
  type LoginRequest,
  type RegisterRequest,
  type RefreshRequest,
  type CreateConsignmentRequest,
  type CreateConsignmentSupplierRequest,
  type ConsignmentDetailResponse,
  type ConsignmentSupplierResponse,
  type ConsignmentSupplierEntity,
  type BrandResponse,
  type TagResponse,
  type PageWithTotalOfConsignmentSearchResult,
  type PageWithTotalOfConsignmentSupplierResponse,
} from './api-client';

export interface ApiClientConfig {
  baseUrl: string;
  getAccessToken?: () => string | null;
  onTokenExpired?: () => void;
}

export class SecondHandShopApiClient {
  private client: Client;
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = config;
    this.client = _heyApiClient;
    this.client.setConfig({
      baseUrl: config.baseUrl,
    });
  }

  /**
   * Get the underlying client instance for advanced usage
   */
  getClient(): Client {
    return this.client;
  }

  /**
   * Set authentication token for subsequent requests
   * Note: This is for cookie-based authentication, not Bearer tokens
   */
  setAuthToken(token: string): void {
    // For cookie-based auth, we need to set the cookie in the client
    // The token should be the actual cookie value
    this.client.setConfig({
      headers: {
        Cookie: `.AspNetCore.Identity.Application=${token}`,
      },
    });
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.client.setConfig({
      headers: {
        Cookie: undefined,
      },
    });
  }

  // Authentication Methods
  async login(credentials: LoginRequest) {
    return postLogin({
      client: this.client,
      body: credentials,
    });
  }

  async register(userData: RegisterRequest) {
    return postRegister({
      client: this.client,
      body: userData,
    });
  }

  async refreshToken(refreshToken: string) {
    return postRefresh({
      client: this.client,
      body: { refreshToken },
    });
  }

  // User Methods
  async getCurrentUser() {
    return getApiUserMe({
      client: this.client,
    });
  }

  // Consignment Methods
  async searchConsignments(skip: number = 0, take: number = 10) {
    return getApiConsignments({
      client: this.client,
      query: { Skip: skip, Take: take },
    });
  }

  async getConsignmentById(id: number) {
    return getApiConsignmentsById({
      client: this.client,
      path: { id },
    });
  }

  async createConsignment(consignment: CreateConsignmentRequest) {
    return postApiConsignments({
      client: this.client,
      body: consignment,
    });
  }

  // Supplier Methods
  async searchSuppliers(skip: number = 0, take: number = 10) {
    return getApiSuppliers({
      client: this.client,
      query: { Skip: skip, Take: take },
    });
  }

  async getAllSuppliers() {
    return getApiSuppliersAll({
      client: this.client,
    });
  }

  async getSupplierById(id: number) {
    return getApiSuppliersById({
      client: this.client,
      path: { id },
    });
  }

  async createSupplier(supplier: CreateConsignmentSupplierRequest) {
    return postApiSuppliers({
      client: this.client,
      body: supplier,
    });
  }

  async updateSupplier(id: number, supplier: ConsignmentSupplierEntity) {
    return putApiSuppliersById({
      client: this.client,
      path: { id },
      body: supplier,
    });
  }

  async deleteSupplier(id: number) {
    return deleteApiSuppliersById({
      client: this.client,
      path: { id },
    });
  }

  // Store Methods
  async getBrands() {
    return getApiStoreBrands({
      client: this.client,
    });
  }

  async getTags() {
    return getApiStoreTags({
      client: this.client,
    });
  }
}

// Export types for external use
export type {
  AccessTokenResponse,
  LoginRequest,
  RegisterRequest,
  RefreshRequest,
  CreateConsignmentRequest,
  CreateConsignmentSupplierRequest,
  ConsignmentDetailResponse,
  ConsignmentSupplierResponse,
  BrandResponse,
  TagResponse,
  PageWithTotalOfConsignmentSearchResult,
  PageWithTotalOfConsignmentSupplierResponse,
};

// Export the generated client functions for direct use if needed
export {
  // All generated functions
  postLogin,
  postRegister,
  postRefresh,
  getApiConsignments,
  postApiConsignments,
  getApiConsignmentsById,
  getApiSuppliers,
  postApiSuppliers,
  getApiSuppliersById,
  putApiSuppliersById,
  deleteApiSuppliersById,
  getApiSuppliersAll,
  getApiStoreBrands,
  getApiStoreTags,
  getApiUserMe,
};
