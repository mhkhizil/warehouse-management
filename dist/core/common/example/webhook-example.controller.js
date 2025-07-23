"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookExampleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const skip_csrf_decorator_1 = require("../decorator/skip-csrf.decorator");
let WebhookExampleController = class WebhookExampleController {
    async paymentWebhook(paymentData) {
        console.log('Payment webhook received:', paymentData);
        return { status: 'success', message: 'Payment webhook processed' };
    }
    async notificationWebhook(notificationData) {
        console.log('Notification webhook received:', notificationData);
        return { status: 'success', message: 'Notification webhook processed' };
    }
    async getWebhookStatus() {
        return { status: 'active', endpoints: ['payment', 'notification'] };
    }
};
exports.WebhookExampleController = WebhookExampleController;
__decorate([
    (0, common_1.Post)('payment'),
    (0, skip_csrf_decorator_1.SkipCsrf)(),
    (0, swagger_1.ApiOperation)({ summary: 'Payment webhook - CSRF protection skipped' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebhookExampleController.prototype, "paymentWebhook", null);
__decorate([
    (0, common_1.Post)('notification'),
    (0, skip_csrf_decorator_1.SkipCsrf)(),
    (0, swagger_1.ApiOperation)({ summary: 'Notification webhook - CSRF protection skipped' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebhookExampleController.prototype, "notificationWebhook", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get webhook status - GET request, no CSRF needed' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebhookExampleController.prototype, "getWebhookStatus", null);
exports.WebhookExampleController = WebhookExampleController = __decorate([
    (0, swagger_1.ApiTags)('Webhook Example'),
    (0, common_1.Controller)('webhook')
], WebhookExampleController);
//# sourceMappingURL=webhook-example.controller.js.map