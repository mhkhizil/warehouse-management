import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './application/exception/global-exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main');
  const config = new DocumentBuilder()
    .setTitle('Car auto parts warehouse management system')
    .setDescription('This is WMS REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  // Only listen on port in development
  if (process.env.NODE_ENV !== 'production') {
    await app.listen(3000);
    logger.log('Application is running on: http://localhost:3000');
  }

  return app;
}

let app;

// Serverless handler for Vercel
export default async function handler(req, res) {
  if (!app) {
    app = await bootstrap();
    await app.init();
  }
  return app.getHttpAdapter().getInstance()(req, res);
}

// For local development
if (require.main === module) {
  bootstrap();
}
