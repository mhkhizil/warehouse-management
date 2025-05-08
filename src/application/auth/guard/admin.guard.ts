import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from 'src/core/common/type/UserEnum';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AdminGuard implements CanActivate {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.user?.id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { role: true },
    });

    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Access denied. Only administrators can perform this action.',
      );
    }

    return true;
  }
}
