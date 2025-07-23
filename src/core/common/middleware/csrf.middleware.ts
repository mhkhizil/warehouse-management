import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Apply cookie parser to parse cookies
    cookieParser()(req, res, next);
  }
}
