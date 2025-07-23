import { Request, Response } from 'express';
export declare class CsrfService {
    private readonly secret;
    generateToken(req: Request, res: Response): string;
    validateToken(req: Request): boolean;
    getTokenFromRequest(req: Request): string | null;
}
