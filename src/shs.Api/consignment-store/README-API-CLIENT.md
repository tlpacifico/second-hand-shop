# Second Hand Shop API Client

This project includes an auto-generated TypeScript client for the Second Hand Shop API, built using the OpenAPI specification.

## 🚀 Quick Start

The API client has been automatically generated from your OpenAPI specification and includes:

- **Type-safe** requests and responses
- **Authentication** handling
- **Error handling** with proper TypeScript types
- **IntelliSense support** in your IDE

## 📁 Generated Files

```
lib/api-client/
├── index.ts              # Main entry point
├── sdk.gen.ts           # Generated API methods
├── types.gen.ts         # TypeScript types
├── client.gen.ts        # HTTP client
└── core/                # Core utilities
```

## 🔧 Installation & Setup

The client is already generated and ready to use. If you need to regenerate it:

```bash
npm run generate-api-client
```

## 📖 Usage Examples

### Basic Setup

```typescript
import { SecondHandShopApiClient } from './lib/api-client-wrapper';

const apiClient = new SecondHandShopApiClient({
  baseUrl: 'http://localhost:5026',
  getAccessToken: () => localStorage.getItem('accessToken'),
  onTokenExpired: () => {
    // Handle token expiration
    window.location.href = '/login';
  },
});
```

### Authentication

```typescript
// Login
const loginResponse = await apiClient.login({
  email: 'user@example.com',
  password: 'password123',
});

if (loginResponse.data) {
  // Store tokens
  localStorage.setItem('accessToken', loginResponse.data.accessToken);
  localStorage.setItem('refreshToken', loginResponse.data.refreshToken);
  
  // Set token for future requests
  apiClient.setAuthToken(loginResponse.data.accessToken);
}

// Register new user
await apiClient.register({
  email: 'newuser@example.com',
  password: 'securepassword',
});

// Refresh token
await apiClient.refreshToken('your-refresh-token');
```

### Working with Consignments

```typescript
// Search consignments with pagination
const consignments = await apiClient.searchConsignments(0, 10);

// Get specific consignment
const consignment = await apiClient.getConsignmentById(123);

// Create new consignment
const newConsignment = await apiClient.createConsignment({
  supplierId: 1,
  consignmentDate: new Date().toISOString(),
  items: [
    {
      name: 'Vintage T-Shirt',
      description: 'Classic band t-shirt',
      price: 25.99,
      size: 'M',
      brandId: 1,
      color: 'Black',
      tagIds: [1, 2],
    },
  ],
});
```

### Managing Suppliers

```typescript
// Get all suppliers
const suppliers = await apiClient.getAllSuppliers();

// Search suppliers with pagination
const paginatedSuppliers = await apiClient.searchSuppliers(0, 20);

// Get specific supplier
const supplier = await apiClient.getSupplierById(1);

// Create new supplier
const newSupplier = await apiClient.createSupplier({
  name: 'John Doe',
  email: 'john@example.com',
  initial: 'JD',
  phoneNumber: '+1-555-0123',
  address: '123 Main St',
  commissionPercentageInCash: 0.6,
  commissionPercentageInProducts: 0.4,
});

// Update supplier
await apiClient.updateSupplier(1, updatedSupplierData);

// Delete supplier
await apiClient.deleteSupplier(1);
```

### Store Data

```typescript
// Get all brands
const brands = await apiClient.getBrands();

// Get all tags
const tags = await apiClient.getTags();

// Load both at once
const [brandsResponse, tagsResponse] = await Promise.all([
  apiClient.getBrands(),
  apiClient.getTags(),
]);
```

### User Profile

```typescript
// Get current user information
const currentUser = await apiClient.getCurrentUser();
```

### Error Handling

```typescript
try {
  const consignment = await apiClient.getConsignmentById(999);
} catch (error: any) {
  if (error.status === 404) {
    console.log('Consignment not found');
  } else if (error.status === 401) {
    console.log('Unauthorized - please login');
    // Redirect to login page
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### React Integration

```typescript
import { useApiClient } from './examples/api-client-usage';

function MyComponent() {
  const { isAuthenticated, login, logout, apiClient } = useApiClient();
  
  const handleLogin = async () => {
    const success = await login('user@example.com', 'password');
    if (success) {
      // Handle successful login
    }
  };
  
  // Use apiClient for API calls...
}
```

## 🔄 Auto-retry with Token Refresh

The client includes automatic token refresh functionality:

```typescript
import { apiCallWithRetry } from './examples/api-client-usage';

// This will automatically retry with a fresh token if the first call fails with 401
const data = await apiCallWithRetry(() => 
  apiClient.getConsignmentById(123)
);
```

## 📋 Available API Methods

### Authentication
- `login(credentials)` - User login
- `register(userData)` - User registration  
- `refreshToken(token)` - Refresh access token

### Consignments
- `searchConsignments(skip, take)` - Search with pagination
- `getConsignmentById(id)` - Get by ID
- `createConsignment(data)` - Create new consignment

### Suppliers
- `searchSuppliers(skip, take)` - Search with pagination
- `getAllSuppliers()` - Get all suppliers
- `getSupplierById(id)` - Get by ID
- `createSupplier(data)` - Create new supplier
- `updateSupplier(id, data)` - Update supplier
- `deleteSupplier(id)` - Delete supplier

### Store
- `getBrands()` - Get all brands
- `getTags()` - Get all tags

### User
- `getCurrentUser()` - Get current user profile

## 🔧 Direct API Usage

You can also use the generated functions directly without the wrapper:

```typescript
import { 
  postLogin, 
  getApiConsignments,
  createClient 
} from './lib/api-client';

const client = createClient({
  baseUrl: 'http://localhost:5026',
});

// Direct function usage
const response = await postLogin({
  client,
  body: { email: 'user@example.com', password: 'password' },
});
```

## 🔄 Regenerating the Client

When your OpenAPI specification changes:

1. Update the `openApi.json` file
2. Run the generation script:
   ```bash
   npm run generate-api-client
   ```

The client will be automatically regenerated with the latest API changes.

## 📝 TypeScript Support

All types are automatically generated and exported:

```typescript
import type {
  ConsignmentDetailResponse,
  CreateConsignmentRequest,
  ConsignmentSupplierResponse,
  BrandResponse,
  TagResponse,
} from './lib/api-client-wrapper';
```

## 🛠️ Customization

The wrapper class (`SecondHandShopApiClient`) can be extended or modified to add:
- Custom error handling
- Request/response interceptors
- Additional authentication methods
- Caching logic
- Custom retry strategies

See `lib/api-client-wrapper.ts` for the implementation details.

## 📞 Support

For issues with the API client:
1. Check if your OpenAPI spec is up to date
2. Regenerate the client with `npm run generate-api-client`
3. Refer to the examples in `examples/api-client-usage.ts`
