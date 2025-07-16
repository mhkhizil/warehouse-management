import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from '../src/application/exception/global-exception.filter';
import { Logger } from '@nestjs/common';
import { VercelRequest, VercelResponse } from '@vercel/node';

let app: any;

async function createNestApp() {
  const nestApp = await NestFactory.create(AppModule);
  const logger = new Logger('Main');

  const config = new DocumentBuilder()
    .setTitle('Car auto parts warehouse management system')
    .setDescription('This is WMS REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(nestApp, config);
  SwaggerModule.setup('api', nestApp, document);

  nestApp.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  nestApp.useGlobalFilters(new GlobalExceptionFilter(logger));

  await nestApp.init();
  return nestApp;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!app) {
    app = await createNestApp();
  }

  return app.getHttpAdapter().getInstance()(req, res);
}
