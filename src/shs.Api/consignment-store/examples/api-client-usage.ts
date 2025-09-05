/**
 * Example usage of the Second Hand Shop API Client
 * 
 * This demonstrates how to use the generated TypeScript client
 * for your Second Hand Shop API.
 */

import { useState } from 'react';
import { SecondHandShopApiClient } from '../src/lib/api-client-wrapper';

// Initialize the API client
const apiClient = new SecondHandShopApiClient({
  baseUrl: 'http://localhost:5026', //
});

// Example usage functions
export async function authenticateUser() {
  try {
    // Login with cookie-based authentication
    const loginResponse = await apiClient.login({
      email: 'test.email@gmail.com',
      password: 'Password12!',
    });

    if (loginResponse.data) {
      // For cookie-based auth, we don't need to manually set tokens
      // The cookies are automatically handled by the browser/client
      // But we can store the response for reference
      localStorage.setItem('authResponse', JSON.stringify(loginResponse.data));
      
      console.log('✅ Login successful');
      return true;
    }
  } catch (error) {
    console.error('❌ Login failed:', error);
    return false;
  }
}

export async function loadUserProfile() {
  try {
    const userResponse = await apiClient.getCurrentUser();
    console.log('👤 Current user:', userResponse.data);
    return userResponse.data;
  } catch (error) {
    console.error('❌ Failed to load user profile:', error);
    throw error;
  }
}

export async function loadConsignments(page = 0, pageSize = 10) {
  try {
    const response = await apiClient.searchConsignments(page * pageSize, pageSize);
    console.log('📦 Consignments:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to load consignments:', error);
    throw error;
  }
}

export async function createNewConsignment() {
  try {
    // First, get available suppliers and brands
    const [suppliersResponse, brandsResponse] = await Promise.all([
      apiClient.getAllSuppliers(),
      apiClient.getBrands(),
    ]);

    const suppliers = suppliersResponse.data;
    const brands = brandsResponse.data;

    if (!suppliers?.length || !brands?.length) {
      throw new Error('No suppliers or brands available');
    }

    // Create a new consignment
    const newConsignment = {
      supplierId: suppliers[0].id!,
      consignmentDate: new Date().toISOString(),
      items: [
        {
          name: 'Vintage T-Shirt',
          description: 'Classic vintage band t-shirt',
          price: 25.99,
          size: 'M',
          brandId: brands[0].id,
          color: 'Black',
          tagIds: [],
        },
      ],
    };

    const response = await apiClient.createConsignment(newConsignment);
    console.log('✅ Consignment created:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to create consignment:', error);
    throw error;
  }
}

export async function loadSuppliers() {
  try {
    const response = await apiClient.getAllSuppliers();
    console.log('👥 Suppliers:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to load suppliers:', error);
    throw error;
  }
}

export async function createNewSupplier() {
  try {
    const newSupplier = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      initial: 'JD',
      phoneNumber: '+1-555-0123',
      address: '123 Main St, City, State',
      commissionPercentageInCash: 0.6,
      commissionPercentageInProducts: 0.4,
    };

    const response = await apiClient.createSupplier(newSupplier);
    console.log('✅ Supplier created:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to create supplier:', error);
    throw error;
  }
}

export async function loadStoreData() {
  try {
    const [brandsResponse, tagsResponse] = await Promise.all([
      apiClient.getBrands(),
      apiClient.getTags(),
    ]);

    console.log('🏷️ Brands:', brandsResponse.data);
    console.log('🏷️ Tags:', tagsResponse.data);

    return {
      brands: brandsResponse.data,
      tags: tagsResponse.data,
    };
  } catch (error) {
    console.error('❌ Failed to load store data:', error);
    throw error;
  }
}

// React Hook example for API integration
export function useApiClient() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const success = await authenticateUser();
      setIsAuthenticated(success || false);
      return success;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // For cookie-based auth, we clear the stored auth response
    localStorage.removeItem('authResponse');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    loading,
    login,
    logout,
    apiClient,
  };
}

// Example of handling errors with proper types
export async function handleApiErrors() {
  try {
    await apiClient.getConsignmentById(999); // Non-existent ID
  } catch (error: any) {
    if (error.status === 404) {
      console.log('Consignment not found');
    } else if (error.status === 401) {
      console.log('Unauthorized - please login');
      // Redirect to login
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// Auto-retry with token refresh
export async function apiCallWithRetry<T>(
  apiCall: () => Promise<T>,
  maxRetries = 1
): Promise<T> {
  try {
    return await apiCall();
  } catch (error: any) {
    if (error.status === 401 && maxRetries > 0) {
      // For cookie-based auth, we might need to re-authenticate
      // or the session might have expired
      console.log('Session expired, attempting to re-authenticate...');
      
      // You could implement automatic re-authentication here
      // For now, we'll just throw the error
    }
    throw error;
  }
}
