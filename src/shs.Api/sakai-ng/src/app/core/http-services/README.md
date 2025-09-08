# HTTP Services Documentation

This directory contains HTTP services for interacting with the Second Hand Shop API.

## Services Overview

### 1. SupplierHttpService
Handles all supplier-related operations.

**Methods:**
- `getSuppliers(params: PaginationParams)` - Get paginated list of suppliers
- `getAllSuppliers()` - Get all suppliers without pagination
- `getSupplierById(id: number)` - Get specific supplier by ID
- `createSupplier(supplier: CreateConsignmentSupplierRequest)` - Create new supplier
- `updateSupplier(id: number, supplier: ConsignmentSupplierEntity)` - Update existing supplier
- `deleteSupplier(id: number)` - Delete supplier

**Usage Example:**
```typescript
import { SupplierHttpService, PaginationParams } from './core/http-services';

constructor(private supplierService: SupplierHttpService) {}

// Get paginated suppliers
const params: PaginationParams = { Skip: 0, Take: 10 };
this.supplierService.getSuppliers(params).subscribe(suppliers => {
  console.log('Suppliers:', suppliers);
});

// Create new supplier
const newSupplier: CreateConsignmentSupplierRequest = {
  name: 'John Doe',
  email: 'john@example.com',
  initial: 'JD',
  phoneNumber: '+1234567890',
  address: '123 Main St',
  commissionPercentageInCash: 10.0,
  commissionPercentageInProducts: 15.0
};

this.supplierService.createSupplier(newSupplier).subscribe(supplier => {
  console.log('Created supplier:', supplier);
});
```

### 2. ConsignmentHttpService
Handles all consignment-related operations.

**Methods:**
- `getConsignments(params: PaginationParams)` - Get paginated list of consignments
- `getConsignmentById(id: number)` - Get specific consignment with details
- `createConsignment(consignment: CreateConsignmentRequest)` - Create new consignment
- `updateConsignment(id: number, consignment: UpdateConsignmentRequest)` - Update existing consignment
- `addConsignmentItem(consignmentId: number, item: AddConsignmentItemRequest)` - Add item to consignment
- `updateConsignmentItem(consignmentId: number, itemId: number, item: UpdateConsignmentItemRequest)` - Update consignment item
- `deleteConsignmentItem(consignmentId: number, itemId: number)` - Delete consignment item

**Usage Example:**
```typescript
import { ConsignmentHttpService, CreateConsignmentRequest } from './core/http-services';

constructor(private consignmentService: ConsignmentHttpService) {}

// Create new consignment
const newConsignment: CreateConsignmentRequest = {
  supplierId: 1,
  consignmentDate: new Date().toISOString()
};

this.consignmentService.createConsignment(newConsignment).subscribe(consignment => {
  console.log('Created consignment:', consignment);
});

// Add item to consignment
const newItem: AddConsignmentItemRequest = {
  name: 'Vintage T-Shirt',
  description: 'Classic vintage t-shirt in excellent condition',
  price: 25.99,
  size: 'M',
  brandId: 1,
  color: 'Blue',
  tagIds: [1, 2, 3]
};

this.consignmentService.addConsignmentItem(1, newItem).subscribe(item => {
  console.log('Added item:', item);
});
```

### 3. StoreHttpService
Handles store-related operations like brands and tags.

**Methods:**
- `getBrands()` - Get all available brands
- `getTags()` - Get all available tags

**Usage Example:**
```typescript
import { StoreHttpService } from './core/http-services';

constructor(private storeService: StoreHttpService) {}

// Get all brands
this.storeService.getBrands().subscribe(brands => {
  console.log('Available brands:', brands);
});

// Get all tags
this.storeService.getTags().subscribe(tags => {
  console.log('Available tags:', tags);
});
```

### 4. UserHttpService
Handles user-related operations.

**Methods:**
- `getCurrentUser()` - Get current user information

**Usage Example:**
```typescript
import { UserHttpService } from './core/http-services';

constructor(private userService: UserHttpService) {}

// Get current user
this.userService.getCurrentUser().subscribe(user => {
  console.log('Current user:', user);
});
```

### 5. AuthHttpService
Handles authentication operations using Firebase.

**Methods:**
- `login(loginData: LoginRequest)` - Login user
- `logout()` - Logout user
- `register(email: string, password: string, displayName?: string)` - Register new user
- `resetPassword(email: string)` - Send password reset email
- `getCurrentUser()` - Get current user information
- `hasRole(role: string)` - Check if user has specific role
- `hasAnyRole(roles: string[])` - Check if user has any of the specified roles

## API Models

All TypeScript interfaces for API requests and responses are defined in `../models/api.models.ts`. These include:

- Request models: `CreateConsignmentRequest`, `UpdateConsignmentRequest`, `AddConsignmentItemRequest`, etc.
- Response models: `ConsignmentDetailResponse`, `ConsignmentSupplierResponse`, `BrandResponse`, etc.
- Utility types: `PaginationParams`

## Error Handling

All services return RxJS Observables. Make sure to handle errors appropriately:

```typescript
this.supplierService.getSuppliers(params).subscribe({
  next: (suppliers) => {
    // Handle success
    console.log('Suppliers loaded:', suppliers);
  },
  error: (error) => {
    // Handle error
    console.error('Error loading suppliers:', error);
  }
});
```

## Authentication

All API endpoints require authentication via Firebase JWT tokens. The `AuthHttpService` handles Firebase authentication, and the `AuthInterceptor` (if configured) automatically adds the Bearer token to requests.

## Environment Configuration

Make sure your `environment.ts` file has the correct API URL:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://api.secondhandstore.local' // or your API URL
};
```
