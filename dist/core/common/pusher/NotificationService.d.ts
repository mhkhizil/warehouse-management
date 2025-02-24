import { OnModuleInit } from '@nestjs/common';
export declare class NotificationService implements OnModuleInit {
    private pusher;
    onModuleInit(): Promise<void>;
    notifyNewOrder(orderId: string, orderDetails: any): Promise<void>;
    notifyOrderReady(orderId: string, tableNumber: string): Promise<void>;
    notifyOrderStatusChange(orderId: string, status: any): Promise<void>;
}
