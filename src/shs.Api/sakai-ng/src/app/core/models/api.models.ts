// API Response Models
export interface PageWithTotalOfConsignmentSearchResult {
  total: number;
  skip: number;
  take: number;
  items: ConsignmentSearchResult[];
}

export interface ConsignmentSearchResult {
  id: number;
  consignmentDate: string;
  supplierName: string;
  totalItems: number;
}

export interface ConsignmentDetailResponse {
  id: number;
  supplierId: number;
  consignmentDate: string;
  items: ConsignmentItemResponse[];
}

export interface ConsignmentItemResponse {
  id: number;
  name: string;
  identificationNumber: string;
  status: any;
  evaluatedValue: number;
  size: string;
  brandId: number;
  color?: string;
  description?: string;
  tagIds: number[];
}

export interface PageWithTotalOfConsignmentSupplierResponse {
  total: number;
  skip: number;
  take: number;
  items: ConsignmentSupplierResponse[];
}

export interface ConsignmentSupplierResponse {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  initials: string;
  commissionPercentageInCash: number;
  commissionPercentageInProducts: number;
}

export interface BrandResponse {
  id: number;
  name: string;
}

export interface TagResponse {
  id: number;
  name: string;
}

// API Request Models
export interface CreateConsignmentRequest {
  supplierId: number;
  consignmentDate: string;
}

export interface UpdateConsignmentRequest {
  supplierId: number;
  consignmentDate: string;
  items: UpdateConsignmentItem[];
  newItems: CreateConsignmentItem[];
  deletedItemsIds: number[];
}

export interface CreateConsignmentItem {
  name: string;
  description?: string;
  price: number;
  size: string;
  brandId?: number;
  tagIds?: number[];
  color?: string;
}

export interface UpdateConsignmentItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  size: string;
  brandId?: number;
  tagIds?: number[];
  color?: string;
}

export interface AddConsignmentItemRequest {
  name: string;
  description?: string;
  price: number;
  size: string;
  brandId: number;
  color?: string;
  tagIds: number[];
}

export interface UpdateConsignmentItemRequest {
  name: string;
  description?: string;
  price: number;
  size: string;
  brandId: number;
  color?: string;
  tagIds: number[];
}

export interface CreateConsignmentSupplierRequest {
  name: string;
  email: string;
  initial: string;
  phoneNumber: string;
  address?: string;
  commissionPercentageInCash?: number;
  commissionPercentageInProducts?: number;
}

export interface UpdateConsignmentSupplierRequest {
  name: string;
  email: string;
  initial: string;
  phoneNumber: string;
  address?: string;
  commissionPercentageInCash?: number;
  commissionPercentageInProducts?: number;
}

export interface ConsignmentSupplierEntity {
  name: string;
  email: string;
  phoneNumber: string;
  initial: string;
  commissionPercentageInCash?: number;
  commissionPercentageInProducts?: number;
  address?: string;
  isDeleted?: boolean;
  deletedBy?: string;
  deletedOn?: string;
  id?: number;
  createdBy: string;
  createdOn: string;
  updatedOn?: string;
  updatedBy?: string;
}

// Query Parameters
export interface PaginationParams {
  Skip: number;
  Take: number;
}
