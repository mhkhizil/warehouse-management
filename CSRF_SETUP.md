# CSRF Protection Setup

This document explains how CSRF (Cross-Site Request Forgery) protection has been implemented in the Car Auto Part WMS application.

## Overview

CSRF protection has been implemented using a custom solution with the double submit cookie pattern. This provides robust protection against cross-site request forgery attacks.

**⚠️ IMPORTANT: CSRF protection is now applied GLOBALLY to ALL non-GET routes automatically.**

## Components

### 1. CSRF Middleware (`src/core/common/middleware/csrf.middleware.ts`)

- Handles cookie parsing for CSRF tokens
- Configures secure cookie settings

### 2. CSRF Service (`src/core/common/service/csrf.service.ts`)

- Provides methods to generate and validate CSRF tokens
- Handles token extraction from requests
- Uses Node.js crypto for secure token generation

### 3. CSRF Guard (`src/core/common/guard/csrf.guard.ts`)

- **GLOBALLY APPLIED** - Validates CSRF tokens for all non-GET routes
- Skips validation for GET, HEAD, and OPTIONS requests
- Throws ForbiddenException for invalid tokens
- Supports `@SkipCsrf()` decorator to exclude specific routes

### 4. CSRF Controller (`src/core/common/controller/csrf.controller.ts`)

- Provides endpoint to get CSRF tokens
- Requires JWT authentication
- Uses `@SkipCsrf()` to exclude itself from CSRF protection

### 5. CSRF Module (`src/core/common/module/csrf.module.ts`)

- Organizes all CSRF-related components
- Marked as global module for easy access

### 6. Skip CSRF Decorator (`src/core/common/decorator/skip-csrf.decorator.ts`)

- Allows specific routes to skip CSRF protection
- Use `@SkipCsrf()` on routes that shouldn't require CSRF tokens

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# CSRF Configuration
CSRF_SECRET=your-super-secret-csrf-key-here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://yourdomain.com
```

## Global Protection

**All POST, PUT, DELETE, PATCH routes are automatically protected with CSRF tokens.**

### Routes that are automatically protected:

- ✅ `POST /auth/register` - User registration (requires JWT + CSRF)
- ✅ `POST /users` - Create user (requires JWT + CSRF)
- ✅ `PUT /users/:id` - Update user (requires JWT + CSRF)
- ✅ `DELETE /users/:id` - Delete user (requires JWT + CSRF)
- ✅ `POST /items` - Create item (requires JWT + CSRF)
- ✅ `PUT /items/:id` - Update item (requires JWT + CSRF)
- ✅ `DELETE /items/:id` - Delete item (requires JWT + CSRF)
- ✅ All other POST/PUT/DELETE/PATCH endpoints

### Routes that are automatically excluded:

- ✅ `GET /users` - Get users (GET request)
- ✅ `GET /items` - Get items (GET request)
- ✅ `GET /csrf/token` - Get CSRF token (uses @SkipCsrf())

### Routes that are manually excluded:

- ✅ `POST /auth/login` - User login (uses @SkipCsrf() - **NO CSRF required**)

## Authentication Flow

### 1. Login (No CSRF Required)

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 2. Get CSRF Token (Requires JWT)

```bash
GET /csrf/token
Authorization: Bearer <jwt-token-from-login>
```

### 3. Make Protected Requests (Requires JWT + CSRF)

```bash
POST /users
Authorization: Bearer <jwt-token>
X-CSRF-Token: <csrf-token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

## Usage

### 1. Getting a CSRF Token

After login, get a CSRF token for subsequent requests:

```bash
GET /csrf/token
Authorization: Bearer <jwt-token>
```

### 2. Using CSRF Token in Requests

Include the CSRF token in the `X-CSRF-Token` header for all state-changing requests:

```bash
POST /users
X-CSRF-Token: <csrf-token>
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### 3. Excluding Routes from CSRF Protection

If you need to exclude a specific route from CSRF protection, use the `@SkipCsrf()` decorator:

```typescript
import { SkipCsrf } from 'src/core/common/decorator/skip-csrf.decorator';

@Post('webhook')
@SkipCsrf()
async webhookHandler(@Body() data: any) {
  // This route will not require CSRF tokens
  return this.service.handleWebhook(data);
}
```

## Security Features

1. **Global Protection**: All non-GET routes automatically protected
2. **Login Exclusion**: Login endpoint excluded to avoid circular dependency
3. **Double Submit Cookie Pattern**: Uses both cookie and header validation
4. **Secure Cookies**: HttpOnly, SameSite=strict, secure in production
5. **Token Expiration**: Tokens expire after 24 hours
6. **Session Binding**: Tokens are bound to user agent
7. **Helmet.js**: Additional security headers
8. **Rate Limiting**: Existing throttler protection
9. **Flexible Exclusion**: Use `@SkipCsrf()` for specific routes

## Testing

### Valid Request Flow:

1. Login: `POST /auth/login` (no CSRF needed)
2. Get JWT token from login response
3. Get CSRF token: `GET /csrf/token` (requires JWT)
4. Make protected request with both JWT and CSRF tokens

### Invalid Request Examples:

- Login without CSRF → Should succeed ✅ (excluded)
- Protected request without CSRF token → 403 Forbidden ❌
- Protected request with invalid CSRF token → 403 Forbidden ❌
- Request from different origin → CORS blocked ❌
