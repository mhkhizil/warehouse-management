"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const global_exception_filter_1 = require("./application/exception/global-exception.filter");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const helmet_1 = __importDefault(require("helmet"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Main');
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: {
            policy: 'cross-origin',
        },
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'blob:', 'http:', 'https:'],
                connectSrc: ["'self'"],
                fontSrc: ["'self'"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"],
            },
        },
    }));
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads',
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Car auto parts warehouse management system')
        .setDescription('This is WMS REST API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || [
            'http://localhost:3000',
            'http://localhost:3001',
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    });
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter(logger));
    if (process.env.NODE_ENV !== 'production') {
        await app.listen(3000);
        logger.log('Application is running on: http://localhost:3000');
    }
    return app;
}
let app;
async function handler(req, res) {
    if (!app) {
        app = await bootstrap();
        await app.init();
    }
    return app.getHttpAdapter().getInstance()(req, res);
}
if (require.main === module) {
    bootstrap();
}
//# sourceMappingURL=main.js.map