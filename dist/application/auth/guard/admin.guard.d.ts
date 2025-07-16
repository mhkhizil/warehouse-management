import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class AdminGuard implements CanActivate {
    private prisma;
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
}
