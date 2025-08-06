import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import Pusher from 'pusher';

@Injectable()
export class NotificationService implements OnModuleInit {
  public pusher: Pusher;

  async onModuleInit() {
    this.pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER,
    });
    // await this.pusher.trigger('restaurant-channel', 'start-event', {
    //   message: 'hello world',
    // });
  }

  async notifyNewOrder(orderId: string, orderDetails: any) {
    try {
      await this.pusher.trigger('restaurant-orders', 'new-order', {
        orderId,
        ...orderDetails,
      });
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: 'Notification triggered failed',
      });
    }
  }

  // Called when chef marks order as ready
  async notifyOrderReady(orderId: string, tableNumber: string) {
    await this.pusher.trigger('restaurant-orders', 'order-ready', {
      orderId,
      tableNumber,
    });
  }

  // Called when order status changes
  async notifyOrderStatusChange(orderId: string, status: any) {
    await this.pusher.trigger('restaurant-orders', 'order-status-changed', {
      orderId,
      status,
    });
  }

  // Debt alert methods
  async sendDebtAlert(alert: any) {
    try {
      await this.pusher.trigger('debt-alerts', 'debt-alert', {
        ...alert,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: 'Debt alert notification failed',
      });
    }
  }

  async sendCustomerDebtAlert(
    customerName: string,
    amount: number,
    dueDate: Date,
    daysUntilDue: number,
  ) {
    await this.sendDebtAlert({
      type: 'customer',
      customerName,
      amount,
      dueDate: dueDate.toISOString(),
      daysUntilDue,
      isOverdue: daysUntilDue < 0,
    });
  }

  async sendSupplierDebtAlert(
    supplierName: string,
    amount: number,
    dueDate: Date,
    daysUntilDue: number,
  ) {
    await this.sendDebtAlert({
      type: 'supplier',
      supplierName,
      amount,
      dueDate: dueDate.toISOString(),
      daysUntilDue,
      isOverdue: daysUntilDue < 0,
    });
  }
}
