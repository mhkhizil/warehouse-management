"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const pusher_1 = __importDefault(require("pusher"));
let NotificationService = class NotificationService {
    async onModuleInit() {
        this.pusher = new pusher_1.default({
            appId: process.env.PUSHER_APP_ID,
            key: process.env.PUSHER_KEY,
            secret: process.env.PUSHER_SECRET,
            cluster: process.env.PUSHER_CLUSTER,
        });
    }
    async notifyNewOrder(orderId, orderDetails) {
        try {
            await this.pusher.trigger('restaurant-orders', 'new-order', {
                orderId,
                ...orderDetails,
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Bad Request', {
                cause: new Error(),
                description: 'Notification triggered failed',
            });
        }
    }
    async notifyOrderReady(orderId, tableNumber) {
        await this.pusher.trigger('restaurant-orders', 'order-ready', {
            orderId,
            tableNumber,
        });
    }
    async notifyOrderStatusChange(orderId, status) {
        await this.pusher.trigger('restaurant-orders', 'order-status-changed', {
            orderId,
            status,
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)()
], NotificationService);
//# sourceMappingURL=NotificationService.js.map