# Content Security Policy (CSP) Security Setup

This document explains the Content Security Policy (CSP) configuration implemented in the Car Auto Part WMS application.

## Overview

Content Security Policy is a security standard that helps prevent various types of attacks, including Cross-Site Scripting (XSS), data injection attacks, and other code injection attacks. Our application uses Helmet.js to implement comprehensive CSP headers.

## Current CSP Configuration

### Base Configuration

```typescript
contentSecurityPolicy: {
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
    connectSrc: ["'self'"],
    fontSrc: ["'self'", 'https:'],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
    upgradeInsecureRequests: [],
    workerSrc: ["'self'"],
    manifestSrc: ["'self'"],
    prefetchSrc: ["'self'"],
    navigateTo: ["'self'"],
  },
  reportOnly: false,
}
```

## CSP Directives Explained

### 1. **defaultSrc: ["'self'"]**

- **Purpose**: Default fallback for other directives
- **Effect**: Only allows resources from the same origin
- **Security**: Prevents loading of external resources by default

### 2. **styleSrc: ["'self'", "'unsafe-inline'"]**

- **Purpose**: Controls where stylesheets can be loaded from
- **Effect**: Allows inline styles and styles from same origin
- **⚠️ Warning**: `'unsafe-inline'` reduces security - consider removing if possible

### 3. **scriptSrc: ["'self'"]**

- **Purpose**: Controls where JavaScript can be loaded from
- **Effect**: Only allows scripts from the same origin
- **Security**: Prevents XSS attacks via external scripts

### 4. **imgSrc: ["'self'", "data:", "blob:", "https:"]**

- **Purpose**: Controls where images can be loaded from
- **Effect**: Allows images from same origin, data URIs, blob URLs, and HTTPS sources
- **Security**: Prevents malicious image loading

### 5. **connectSrc: ["'self'"]**

- **Purpose**: Controls where the application can make network requests
- **Effect**: Only allows connections to the same origin
- **Security**: Prevents data exfiltration

### 6. **fontSrc: ["'self'", "https:"]**

- **Purpose**: Controls where fonts can be loaded from
- **Effect**: Allows fonts from same origin and HTTPS sources
- **Security**: Prevents malicious font loading

### 7. **objectSrc: ["'none'"]**

- **Purpose**: Controls where plugins can be loaded from
- **Effect**: Completely blocks plugins (Flash, Java, etc.)
- **Security**: Prevents plugin-based attacks

### 8. **frameSrc: ["'none'"]**

- **Purpose**: Controls where frames can be loaded from
- **Effect**: Completely blocks iframes
- **Security**: Prevents clickjacking attacks

### 9. **frameAncestors: ["'none'"]**

- **Purpose**: Controls where the page can be embedded
- **Effect**: Prevents the page from being embedded in iframes
- **Security**: Prevents clickjacking attacks

### 10. **baseUri: ["'self'"]**

- **Purpose**: Controls the base URI for relative URLs
- **Effect**: Only allows base URI from same origin
- **Security**: Prevents base tag hijacking

### 11. **formAction: ["'self'"]**

- **Purpose**: Controls where forms can be submitted to
- **Effect**: Only allows form submissions to same origin
- **Security**: Prevents form data exfiltration

### 12. **upgradeInsecureRequests: []**

- **Purpose**: Automatically upgrades HTTP requests to HTTPS
- **Effect**: Forces secure connections
- **Security**: Prevents man-in-the-middle attacks

## Additional Security Headers

### HSTS (HTTP Strict Transport Security)

```typescript
hsts: {
  maxAge: 31536000,        // 1 year
  includeSubDomains: true, // Apply to all subdomains
  preload: true,           // Include in browser preload lists
}
```

### Other Security Headers

- **noSniff**: Prevents MIME type sniffing
- **referrerPolicy**: Controls referrer information
- **xssFilter**: Enables XSS protection
- **frameguard**: Prevents clickjacking

## Security Benefits

### 1. **XSS Protection**

- Prevents execution of malicious scripts
- Blocks inline script injection
- Restricts script sources to trusted domains

### 2. **Clickjacking Protection**

- `frameAncestors: ["'none'"]` prevents embedding
- `frameguard: { action: 'deny' }` adds additional protection

### 3. **Data Exfiltration Prevention**

- `connectSrc: ["'self'"]` restricts network requests
- `formAction: ["'self'"]` prevents form data theft

### 4. **Resource Injection Prevention**

- `objectSrc: ["'none'"]` blocks plugins
- `imgSrc` restrictions prevent malicious images

## Monitoring and Reporting

### CSP Violation Monitoring

To monitor CSP violations, you can add a reporting endpoint:

```typescript
contentSecurityPolicy: {
  directives: {
    // ... existing directives
  },
  reportOnly: false,
  reportUri: '/csp-violation-report', // Optional: for monitoring
}
```

### CSP Violation Handler

```typescript
@Post('csp-violation-report')
@SkipCsrf()
async handleCspViolation(@Body() report: any) {
  // Log CSP violations for monitoring
  this.logger.warn('CSP Violation:', report);
  return { status: 'ok' };
}
```

## Best Practices

### 1. **Avoid 'unsafe-inline'**

- Consider removing `'unsafe-inline'` from `styleSrc`
- Use nonces or hashes for inline styles if needed

### 2. **Regular Review**

- Review CSP directives regularly
- Monitor violation reports
- Update policies based on application needs

### 3. **Environment-Specific Configuration**

```typescript
const cspConfig =
  process.env.NODE_ENV === 'production'
    ? {
        // Stricter production config
        styleSrc: ["'self'"], // Remove 'unsafe-inline'
      }
    : {
        // More permissive development config
        styleSrc: ["'self'", "'unsafe-inline'"],
      };
```

### 4. **Testing CSP**

- Test CSP in development environment
- Use browser developer tools to check for violations
- Verify all resources load correctly

## Common Issues and Solutions

### 1. **Swagger UI Issues**

If Swagger UI doesn't work with strict CSP:

```typescript
scriptSrc: ["'self'", "'unsafe-inline'"], // For Swagger UI
styleSrc: ["'self'", "'unsafe-inline'"], // For Swagger UI
```

### 2. **External Resources**

If you need to load external resources:

```typescript
imgSrc: ["'self'", "https://trusted-cdn.com"],
fontSrc: ["'self'", "https://fonts.googleapis.com"],
```

### 3. **WebSocket Connections**

If using WebSockets:

```typescript
connectSrc: ["'self'", "wss://your-websocket-server.com"],
```

## Security Checklist

- [x] CSP headers configured
- [x] HSTS enabled
- [x] XSS protection enabled
- [x] Clickjacking protection enabled
- [x] MIME sniffing disabled
- [x] Referrer policy set
- [x] Frame ancestors restricted
- [x] Object sources blocked
- [ ] CSP violation monitoring (optional)
- [ ] Regular CSP policy review
- [ ] Production-specific CSP configuration

## Conclusion

The current CSP configuration provides strong security against common web vulnerabilities. The policy is comprehensive and follows security best practices. Regular monitoring and updates will ensure continued protection as the application evolves.
