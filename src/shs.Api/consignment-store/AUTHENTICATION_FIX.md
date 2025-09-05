# Authentication Fix Documentation

## Problem
The authentication was not working because there was a mismatch between the backend and frontend authentication mechanisms:

### Backend Configuration
- Uses **ASP.NET Core Identity** with **cookie-based authentication**
- Configured in `Program.cs` with `AddCookie(IdentityConstants.ApplicationScheme)`
- Cookies are automatically handled by the browser

### Frontend Configuration (Before Fix)
- The API client wrapper was trying to use **Bearer token authentication**
- Setting `Authorization: Bearer ${token}` headers
- This doesn't work with cookie-based authentication

## Solution
Updated the API client wrapper to properly handle cookie-based authentication:

### Changes Made

1. **Updated `api-client-wrapper.ts`**:
   - Changed `setAuthToken()` to set cookies instead of Bearer tokens
   - Changed `clearAuthToken()` to clear cookies instead of Authorization headers
   - Updated comments to reflect cookie-based authentication

2. **Updated `api-client-usage.ts`**:
   - Removed manual token storage and setting
   - Updated to use correct test credentials (`test.email@gmail.com` / `Password12!`)
   - Simplified authentication flow since cookies are handled automatically

3. **Created test script** (`test-auth.js`):
   - Simple Node.js script to verify authentication works
   - Tests login and protected endpoint access

## How Cookie-Based Authentication Works

1. **Login**: POST to `/login?useCookies=true` with credentials
2. **Response**: Server sets authentication cookies in response headers
3. **Subsequent Requests**: Browser automatically includes cookies in requests
4. **No Manual Token Management**: Cookies are handled automatically by the browser

## Testing Authentication

### Using the Test Script
```bash
cd src/shs.Api/consignment-store
node test-auth.js
```

### Using the API Client
```typescript
import { SecondHandShopApiClient } from './src/lib/api-client-wrapper';

const apiClient = new SecondHandShopApiClient({
  baseUrl: 'http://localhost:5026'
});

// Login (cookies are handled automatically)
const loginResponse = await apiClient.login({
  email: 'test.email@gmail.com',
  password: 'Password12!'
});

// Access protected endpoints (cookies are sent automatically)
const userData = await apiClient.getCurrentUser();
```

## Important Notes

1. **Browser Environment**: Cookie-based authentication works best in browser environments where cookies are automatically handled
2. **CORS Configuration**: The backend is configured to allow cookies from specific origins
3. **Test User**: Use the test credentials (`test.email@gmail.com` / `Password12!`) for testing
4. **No Manual Token Management**: Unlike Bearer tokens, you don't need to manually set or refresh cookies

## Troubleshooting

If authentication still doesn't work:

1. **Check CORS**: Ensure the frontend origin is allowed in the backend CORS configuration
2. **Check Cookie Domain**: Verify the cookie domain matches your setup
3. **Check HTTPS**: In production, ensure HTTPS is used for secure cookie transmission
4. **Check Browser Console**: Look for CORS or cookie-related errors

## Migration from Bearer Tokens

If you were previously using Bearer token authentication:

1. Remove manual token storage (`localStorage.setItem('accessToken', ...)`)
2. Remove manual token setting (`apiClient.setAuthToken(...)`)
3. Remove token refresh logic (cookies are handled automatically)
4. Update error handling to account for cookie-based authentication
