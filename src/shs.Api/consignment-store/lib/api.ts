import axios from 'axios';

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
  login: async (data: { email: string; password: string; twoFactorCode?: string; twoFactorRecoveryCode?: string }) => {
    return api.post('/login', data, { params: { useCookies: true } });
  },
  register: async (data: { email: string; password: string }) => {
    return api.post('/register', data);
  },
  logout: async () => {
    // You might want to handle logout locally by clearing cookies/storage
  },
};

// Consignment endpoints
export const consignments = {
  getOwners: async () => {
    return api.get('/api/consignments/owners');
  },
  getOwner: async (id: number) => {
    return api.get(`/api/consignments/owners/${id}`);
  },
  createOwner: async (data: {
    name: string;
    email: string;
    phoneNumber: string;
    address?: string;
  }) => {
    return api.post('/api/consignments/owners', data);
  },
  updateOwner: async (id: number, data: {
    name: string;
    email: string;
    phoneNumber: string;
    address?: string;
  }) => {
    return api.put(`/api/consignments/owners/${id}`, data);
  },
  deleteOwner: async (id: number) => {
    return api.delete(`/api/consignments/owners/${id}`);
  },
  getConsignments: async (ownerId: number) => {
    return api.get(`/api/consignments/owners/${ownerId}/consigned`);
  },
  createConsignment: async (data: {
    ownerId: number;
    consignmentDate: string;
    pickupDate?: string;
    items: Array<{
      name: string;
      description?: string;
      price: number;
      status?: number;
      size?: number;
      brandId?: number;
      tagIds?: number[];
    }>;
  }) => {
    return api.post('/api/consignments', data);
  },
};

export const store = { 
  getBrands: async () => {
    return api.get('/api/store/brands');
  },
  getTags: async () => {
    return api.get('/api/store/tags');
  },
 
}

// User management endpoints
export const user = {
  getInfo: async () => {
    return api.get('/manage/info');
  },
  updateInfo: async (data: { newEmail?: string; newPassword?: string; oldPassword?: string }) => {
    return api.post('/manage/info', data);
  },
  manage2FA: async (data: {
    enable?: boolean;
    twoFactorCode?: string;
    resetSharedKey?: boolean;
    resetRecoveryCodes?: boolean;
    forgetMachine?: boolean;
  }) => {
    return api.post('/manage/2fa', data);
  },
};

export default api;