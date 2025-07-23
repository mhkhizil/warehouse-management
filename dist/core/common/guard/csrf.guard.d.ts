import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CsrfService } from '../service/csrf.service';
export declare class CsrfGuard implements CanActivate {
    private readonly csrfService;
    private readonly reflector;
    constructor(csrfService: CsrfService, reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
