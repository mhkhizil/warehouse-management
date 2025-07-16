import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      // Optimize for serverless environments
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.error('Failed to connect to database:', error);
      // In serverless environments, we might want to continue without throwing
      if (process.env.NODE_ENV !== 'production') {
        throw error;
      }
    }
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

      await Promise.all(models.map((modelKey) => this[modelKey].deleteMany()));

      // Run seed after cleaning
      try {
        await execAsync('npm run db:seed');
        console.log('Database seeded successfully');
      } catch (error) {
        console.error('Error seeding database:', error);
      }
    }
  }
}
