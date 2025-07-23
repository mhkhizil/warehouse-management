import { Request, Response } from 'express';
import { CsrfService } from '../service/csrf.service';
export declare class CsrfController {
    private readonly csrfService;
    constructor(csrfService: CsrfService);
    getCsrfToken(req: Request, res: Response): Response<any, Record<string, any>>;
}
