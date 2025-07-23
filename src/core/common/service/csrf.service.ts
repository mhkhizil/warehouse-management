import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class CsrfService {
  private readonly secret = process.env.CSRF_SECRET || 'your-csrf-secret-key';

  /**
   * Generate a CSRF token for the current session
   */
  generateToken(req: Request, res: Response): string {
    const sessionId = req.headers['user-agent'] || 'unknown';
    const token = crypto.randomBytes(32).toString('hex');

    // Set the token in a cookie
    res.cookie('X-CSRF-Token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return token;
  }

  /**
   * Validate CSRF token from request
   */
  validateToken(req: Request): boolean {
    const headerToken = req.headers['x-csrf-token'] as string;
    const cookieToken = req.cookies?.['X-CSRF-Token'];

    if (!headerToken || !cookieToken) {
      return false;
    }

    // Compare the token from header with the token from cookie
    return headerToken === cookieToken;
  }

  /**
   * Get CSRF token from request headers
   */
  getTokenFromRequest(req: Request): string | null {
    return (req.headers['x-csrf-token'] as string) || null;
  }
}
