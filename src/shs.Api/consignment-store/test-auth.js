/**
 * Simple test script to verify authentication is working
 * Run this with: node test-auth.js
 * 
 * Note: Requires Node.js 18+ for built-in fetch support
 */

async function testAuthentication() {
  const baseUrl = 'http://localhost:5026';
  
  console.log('🔐 Testing authentication...');
  
  try {
    // Step 1: Try to register the test user first
    console.log('📝 Attempting to register test user...');
    const registerResponse = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test.email@gmail.com',
        password: 'Password12!'
      })
    });

    console.log('Register response status:', registerResponse.status);
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Registration successful:', registerData);
    } else if (registerResponse.status === 400) {
      console.log('ℹ️ User might already exist, continuing with login...');
    } else {
      const errorText = await registerResponse.text();
      console.log('❌ Registration failed:', errorText);
    }
    
    // Step 2: Try to login
    console.log('📝 Attempting login...');
    const loginResponse = await fetch(`${baseUrl}/login?useCookies=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test.email@gmail.com',
        password: 'Password12!'
      })
    });

    console.log('Login response status:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful:', loginData);
      
      // Extract cookies from response
      const cookies = loginResponse.headers.get('set-cookie');
      console.log('🍪 Cookies received:', cookies);
      
      if (cookies) {
        // Step 3: Try to access a protected endpoint
        console.log('🔒 Testing protected endpoint...');
        const userResponse = await fetch(`${baseUrl}/api/user/me`, {
          method: 'GET',
          headers: {
            'Cookie': cookies
          }
        });
        
        console.log('User endpoint response status:', userResponse.status);
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log('✅ User data retrieved:', userData);
        } else {
          console.log('❌ Failed to get user data');
          const errorText = await userResponse.text();
          console.log('Error details:', errorText);
        }
      } else {
        console.log('❌ No cookies received from login');
      }
    } else {
      console.log('❌ Login failed');
      const errorText = await loginResponse.text();
      console.log('Error details:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testAuthentication();
