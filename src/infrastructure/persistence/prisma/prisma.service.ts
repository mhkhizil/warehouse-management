import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Helper method for cleaning up database during testing
   */
  async cleanDatabase() {
    if (process.env.NODE_ENV !== 'production') {
      // Add model cleanup as needed for testing
      const models = Reflect.ownKeys(this).filter(
        (key) =>
          key[0] !== '_' &&
          key[0] !== '$' &&
          typeof this[key] === 'object' &&
          this[key] !== null,
      );

      return Promise.all(models.map((modelKey) => this[modelKey].deleteMany()));
    }
  }
}
