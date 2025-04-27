import axios from 'axios';

// Response Types
interface AccessTokenResponse {
  tokenType?: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

interface BrandResponse {
  id: number;
  name: string;
}

interface TagResponse {
  id: number;
  name: string;
}

interface InfoResponse {
  email: string;
  isEmailConfirmed: boolean;
}

interface TwoFactorResponse {
  sharedKey: string;
  recoveryCodesLeft: number;
  recoveryCodes?: string[];
  isTwoFactorEnabled: boolean;
  isMachineRemembered: boolean;
}

export interface PagedModel<T> {
  items: T[];
  total: number;
  skip: number;
  take: number;
}

export interface ConsignmentSupplierEntity {
  name: string;
  email: string;
  phoneNumber: string;
  initials: string;
  commissionPercentageInCash?: number;
  commissionPercentageInProducts?: number;
  address?: string;
  isDeleted: boolean;
  deletedBy?: string;
  deletedOn?: string;
  id: number;
  createdBy: string;
  createdOn: string;
  updatedOn?: string;
  updatedBy?: string;
}

export interface ConsignmentSearchResult {
  id: number;
  consignmentDate: string;
  supplierName: string;
  totalItems: number;
}

export interface ConsignmentItemResponse {
  id: number;
  identificationNumber: string;
  status: number;
  size: string;
  brandId?: number;
  name: string;
  description?: string;
  color?: string;
  evaluatedValue: number;
  tagIds?: number[];
}

export interface ConsignmentDetailResponse {
  id: number;
  supplierId: number;
  consignmentDate: string;
  items: ConsignmentItemResponse[];
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // This is important for cookie handling
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to handle authentication
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: async (data: { email: string; password: string; twoFactorCode?: string; twoFactorRecoveryCode?: string }): Promise<AccessTokenResponse> => {
    const response = await api.post('/login', data, { params: { useCookies: true } });
    return response.data;
  },
  register: async (data: { email: string; password: string }): Promise<void> => {
    await api.post('/register', data);
  },
  logout: async () => {
    // You might want to handle logout locally by clearing cookies/storage
  },
};

// Consignment endpoints
export const consignments = {
  getOwners: async (skip = 0, take = 10): Promise<PagedModel<ConsignmentSupplierEntity>> => {
    const response = await api.get(`/api/consignments/owners?skip=${skip}&take=${take}`);
    return response.data;
  },
  getAllOwners: async (): Promise<ConsignmentSupplierEntity[]> => {
    const response = await api.get(`/api/consignments/owners/all`);
    return response.data;
  },
  getOwner: async (id: number): Promise<ConsignmentSupplierEntity> => {
    const response = await api.get(`/api/consignments/owners/${id}`);
    return response.data;
  },
  createOwner: async (data: {
    name: string;
    email: string;
    phoneNumber: string;
    initial: string;
    address?: string;
    commissionPercentageInCash?: number;
    commissionPercentageInProducts?: number;
  }): Promise<void> => {
    await api.post('/api/consignments/owners', data);
  },
  updateOwner: async (id: number, data: ConsignmentSupplierEntity): Promise<void> => {
    await api.put(`/api/consignments/owners/${id}`, data);
  },
  deleteOwner: async (id: number): Promise<void> => {
    await api.delete(`/api/consignments/owners/${id}`);
  },
  getConsignments: async (ownerId: number) => {
    return api.get(`/api/consignments/owners/${ownerId}/consigned`);
  },
  createConsignment: async (data: {
    supplierId: number;
    consignmentDate: string;
    pickupDate?: string;
    items: Array<{
      name: string;
      description?: string;
      price: number;
      status?: number;
      size?: string;
      brandId?: number;
      tagIds?: number[];
    }>;
  }): Promise<void> => {
    await api.post('/api/consignments', data);
  },
  getPaginatedConsignments: async (skip = 0, take = 10): Promise<PagedModel<ConsignmentSearchResult>> => {
    const response = await api.get(`/api/consignments?Skip=${skip}&Take=${take}`);
    return response.data;
  },
  getConsignmentDetails: async (id: number): Promise<ConsignmentDetailResponse> => {
    const response = await api.get(`/api/consignments/${id}`);
    return response.data;
  }
};

export const store = { 
  getBrands: async (): Promise<BrandResponse[]> => {
    const response = await api.get('/api/store/brands');
    return response.data;
  },
  getTags: async (): Promise<TagResponse[]> => {
    const response = await api.get('/api/store/tags');
    return response.data;
  },
}

// User management endpoints
export const user = {
  getInfo: async (): Promise<InfoResponse> => {
    const response = await api.get('/manage/info');
    return response.data;
  },
  updateInfo: async (data: { newEmail?: string; newPassword?: string; oldPassword?: string }): Promise<InfoResponse> => {
    const response = await api.post('/manage/info', data);
    return response.data;
  },
  manage2FA: async (data: {
    enable?: boolean;
    twoFactorCode?: string;
    resetSharedKey?: boolean;
    resetRecoveryCodes?: boolean;
    forgetMachine?: boolean;
  }): Promise<TwoFactorResponse> => {
    const response = await api.post('/manage/2fa', data);
    return response.data;
  },
};

export default api;