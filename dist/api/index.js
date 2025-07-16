"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const swagger_1 = require("@nestjs/swagger");
const global_exception_filter_1 = require("../src/application/exception/global-exception.filter");
const common_1 = require("@nestjs/common");
let app;
async function createNestApp() {
    const nestApp = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Main');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Car auto parts warehouse management system')
        .setDescription('This is WMS REST API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(nestApp, config);
    swagger_1.SwaggerModule.setup('api', nestApp, document);
    nestApp.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    nestApp.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter(logger));
    await nestApp.init();
    return nestApp;
}
async function handler(req, res) {
    if (!app) {
        app = await createNestApp();
    }
    return app.getHttpAdapter().getInstance()(req, res);
}
//# sourceMappingURL=index.js.map