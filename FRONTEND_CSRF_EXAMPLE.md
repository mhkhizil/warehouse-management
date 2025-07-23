# Frontend CSRF Integration Example

This document provides examples of how to integrate CSRF protection in frontend applications.

**⚠️ IMPORTANT: CSRF protection is now GLOBAL. All POST, PUT, DELETE, PATCH requests require CSRF tokens automatically.**

**🔑 EXCEPTION: Login endpoint (`POST /auth/login`) does NOT require CSRF tokens.**

## Authentication Flow

### 1. Login (No CSRF Required)

```typescript
// Login doesn't need CSRF tokens
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return data.token; // JWT token
};
```

### 2. Get CSRF Token (Requires JWT)

```typescript
// Get CSRF token after login
const getCsrfToken = async (jwtToken: string) => {
  const response = await fetch('/api/csrf/token', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json();
  return data.token; // CSRF token
};
```

### 3. Make Protected Requests (Requires JWT + CSRF)

```typescript
// All other POST/PUT/DELETE requests need both JWT and CSRF
const createUser = async (
  userData: any,
  jwtToken: string,
  csrfToken: string,
) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
      'X-CSRF-Token': csrfToken,
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  });

  return response.json();
};
```

## JavaScript/TypeScript Example

```typescript
class ApiClient {
  private baseUrl: string;
  private jwtToken: string | null = null;
  private csrfToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Login - NO CSRF token required
  async login(email: string, password: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    this.jwtToken = data.token;
    return data.token;
  }

  // Get CSRF token - requires JWT token
  async getCsrfToken(): Promise<string> {
    if (!this.jwtToken) {
      throw new Error('JWT token required. Please login first.');
    }

    const response = await fetch(`${this.baseUrl}/csrf/token`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.jwtToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get CSRF token');
    }

    const data = await response.json();
    this.csrfToken = data.token;
    return data.token;
  }

  // Create user - requires both JWT and CSRF tokens
  async createUser(userData: any): Promise<any> {
    if (!this.jwtToken) {
      throw new Error('JWT token required. Please login first.');
    }

    if (!this.csrfToken) {
      await this.getCsrfToken();
    }

    const response = await fetch(`${this.baseUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.jwtToken}`,
        'X-CSRF-Token': this.csrfToken!,
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    return response.json();
  }

  // Update user - requires both JWT and CSRF tokens
  async updateUser(id: string, userData: any): Promise<any> {
    if (!this.jwtToken) {
      throw new Error('JWT token required. Please login first.');
    }

    if (!this.csrfToken) {
      await this.getCsrfToken();
    }

    const response = await fetch(`${this.baseUrl}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.jwtToken}`,
        'X-CSRF-Token': this.csrfToken!,
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return response.json();
  }

  // Delete user - requires both JWT and CSRF tokens
  async deleteUser(id: string): Promise<any> {
    if (!this.jwtToken) {
      throw new Error('JWT token required. Please login first.');
    }

    if (!this.csrfToken) {
      await this.getCsrfToken();
    }

    const response = await fetch(`${this.baseUrl}/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.jwtToken}`,
        'X-CSRF-Token': this.csrfToken!,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    return response.json();
  }

  // GET requests don't need CSRF tokens
  async getUsers(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get users');
    }

    return response.json();
  }
}

// Usage
const apiClient = new ApiClient('http://localhost:3000');

// Complete authentication flow
async function authenticateAndCreateUser() {
  try {
    // 1. Login (no CSRF needed)
    const jwtToken = await apiClient.login('user@example.com', 'password123');
    console.log('Login successful, JWT token:', jwtToken);

    // 2. Get CSRF token (requires JWT)
    const csrfToken = await apiClient.getCsrfToken();
    console.log('CSRF token obtained:', csrfToken);

    // 3. Create user (requires both JWT and CSRF)
    const newUser = await apiClient.createUser({
      name: 'John Doe',
      email: 'john@example.com',
    });
    console.log('User created:', newUser);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## React Example

```typescript
import React, { useState } from 'react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Login doesn't need CSRF tokens
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('jwt-token', data.token);

      console.log('Login successful:', data);
      // Handle successful login
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};
```

## Axios Example

```typescript
import axios from 'axios';

// Create axios instance with CSRF support
const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // Important for cookies
});

// Request interceptor to add CSRF token to ALL non-GET requests (except login)
api.interceptors.request.use(async (config) => {
  // Skip CSRF for GET, HEAD, and OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(config.method?.toUpperCase() || '')) {
    return config;
  }

  // Skip CSRF for login endpoint
  if (config.url === '/auth/login') {
    return config;
  }

  // Get CSRF token if not available (required for all other POST/PUT/DELETE/PATCH)
  if (!api.csrfToken) {
    try {
      const jwtToken = localStorage.getItem('jwt-token');
      const response = await axios.get(`${config.baseURL}/csrf/token`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
        withCredentials: true,
      });
      api.csrfToken = response.data.token;
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
    }
  }

  // Add CSRF token to headers for all non-GET requests (except login)
  if (api.csrfToken) {
    config.headers['X-CSRF-Token'] = api.csrfToken;
  }

  return config;
});

// Response interceptor to handle CSRF errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 403 &&
      error.response?.data?.message?.includes('CSRF')
    ) {
      // Clear CSRF token and retry
      api.csrfToken = null;
      console.error('CSRF token invalid, please retry');
    }
    return Promise.reject(error);
  },
);

// Usage examples
const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('jwt-token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

const createUser = async (userData: any) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Create user failed:', error);
    throw error;
  }
};

const updateUser = async (id: string, userData: any) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Update user failed:', error);
    throw error;
  }
};

const deleteUser = async (id: string) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete user failed:', error);
    throw error;
  }
};

// GET requests don't need CSRF tokens
const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Get users failed:', error);
    throw error;
  }
};
```

## Important Notes

1. **Login Exception**: `POST /auth/login` does NOT require CSRF tokens
2. **Global CSRF Protection**: All other POST, PUT, DELETE, PATCH requests require CSRF tokens
3. **Authentication Flow**: Login → Get JWT → Get CSRF → Make protected requests
4. **Always include credentials**: Set `credentials: 'include'` or `withCredentials: true`
5. **Handle errors gracefully**: CSRF token errors should be handled and tokens refreshed
6. **Secure storage**: Store JWT tokens securely (not in localStorage for production)
7. **HTTPS in production**: Always use HTTPS in production for secure cookie transmission
8. **GET requests are safe**: GET requests don't require CSRF tokens

## Testing

To test CSRF protection:

1. **Login without CSRF token** → Should succeed ✅ (excluded)
2. **GET request without CSRF token** → Should succeed ✅
3. **POST request without CSRF token** → Should return 403 ❌
4. **POST request with invalid CSRF token** → Should return 403 ❌
5. **POST request with valid CSRF token** → Should succeed ✅
6. **Request from different origin** → Should be blocked by CORS ❌

## Request Flow

1. **Login**: `POST /auth/login` (no CSRF needed)
2. **Get JWT token** from login response
3. **Get CSRF token**: `GET /csrf/token` (requires JWT)
4. **Make protected requests**: Include both JWT and CSRF tokens
