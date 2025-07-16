"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const global_exception_filter_1 = require("./application/exception/global-exception.filter");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Main');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Car auto parts warehouse management system')
        .setDescription('This is WMS REST API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
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