import { Global, Module } from '@nestjs/common';
import { PrismaService } from '@src/core/common/prisma/PrismaService';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
