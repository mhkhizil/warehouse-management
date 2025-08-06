import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { NotificationService } from './NotificationService';
import { PrismaService } from '../prisma/PrismaService';

export interface DebtAlert {
  id: number;
  type: 'customer' | 'supplier';
  entityId: number;
  entityName: string;
  amount: number;
  dueDate: Date;
  daysUntilDue: number;
  isOverdue: boolean;
  alertType: 'approaching' | 'due' | 'overdue';
}

@Injectable()
export class DebtAlertService {
  private readonly logger = new Logger(DebtAlertService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Check for debt alerts every hour
   */
  @Cron(CronExpression.EVERY_HOUR)
  async checkDebtAlerts() {
    this.logger.log('Checking for debt alerts...');

    try {
      await Promise.all([
        this.checkCustomerDebtAlerts(),
        this.checkSupplierDebtAlerts(),
      ]);
    } catch (error) {
      this.logger.error('Error checking debt alerts:', error);
    }
  }

  /**
   * Check for overdue debts daily at 9 AM
   */
  @Cron('0 9 * * *')
  async checkOverdueDebts() {
    this.logger.log('Checking for overdue debts...');

    try {
      await Promise.all([
        this.checkCustomerOverdueDebts(),
        this.checkSupplierOverdueDebts(),
      ]);
    } catch (error) {
      this.logger.error('Error checking overdue debts:', error);
    }
  }

  private async checkCustomerDebtAlerts() {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Get customer debts that are due soon or overdue
    const customerDebts = await this.prisma.debt.findMany({
      where: {
        isSettled: false,
        dueDate: {
          lte: threeDaysFromNow,
        },
        alertSent: false,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    for (const debt of customerDebts) {
      const daysUntilDue = Math.ceil(
        (debt.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      const isOverdue = debt.dueDate < now;

      let alertType: 'approaching' | 'due' | 'overdue';
      if (isOverdue) {
        alertType = 'overdue';
      } else if (debt.dueDate <= oneDayFromNow) {
        alertType = 'due';
      } else {
        alertType = 'approaching';
      }

      const alert: DebtAlert = {
        id: debt.id,
        type: 'customer',
        entityId: debt.customer.id,
        entityName: debt.customer.name,
        amount: debt.amount,
        dueDate: debt.dueDate,
        daysUntilDue,
        isOverdue,
        alertType,
      };

      await this.sendDebtAlert(alert);
      await this.markAlertAsSent(debt.id, 'customer');
    }
  }

  private async checkSupplierDebtAlerts() {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Get supplier debts that are due soon or overdue
    const supplierDebts = await this.prisma.supplierDebt.findMany({
      where: {
        isSettled: false,
        dueDate: {
          lte: threeDaysFromNow,
        },
        alertSent: false,
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    for (const debt of supplierDebts) {
      const daysUntilDue = Math.ceil(
        (debt.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      const isOverdue = debt.dueDate < now;

      let alertType: 'approaching' | 'due' | 'overdue';
      if (isOverdue) {
        alertType = 'overdue';
      } else if (debt.dueDate <= oneDayFromNow) {
        alertType = 'due';
      } else {
        alertType = 'approaching';
      }

      const alert: DebtAlert = {
        id: debt.id,
        type: 'supplier',
        entityId: debt.supplier.id,
        entityName: debt.supplier.name,
        amount: debt.amount,
        dueDate: debt.dueDate,
        daysUntilDue,
        isOverdue,
        alertType,
      };

      await this.sendDebtAlert(alert);
      await this.markAlertAsSent(debt.id, 'supplier');
    }
  }

  private async checkCustomerOverdueDebts() {
    const now = new Date();

    // Get customer debts that are overdue
    const overdueCustomerDebts = await this.prisma.debt.findMany({
      where: {
        isSettled: false,
        dueDate: {
          lt: now,
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    for (const debt of overdueCustomerDebts) {
      const daysOverdue = Math.ceil(
        (now.getTime() - debt.dueDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      const alert: DebtAlert = {
        id: debt.id,
        type: 'customer',
        entityId: debt.customer.id,
        entityName: debt.customer.name,
        amount: debt.amount,
        dueDate: debt.dueDate,
        daysUntilDue: -daysOverdue,
        isOverdue: true,
        alertType: 'overdue',
      };

      await this.sendDebtAlert(alert);
    }
  }

  private async checkSupplierOverdueDebts() {
    const now = new Date();

    // Get supplier debts that are overdue
    const overdueSupplierDebts = await this.prisma.supplierDebt.findMany({
      where: {
        isSettled: false,
        dueDate: {
          lt: now,
        },
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    for (const debt of overdueSupplierDebts) {
      const daysOverdue = Math.ceil(
        (now.getTime() - debt.dueDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      const alert: DebtAlert = {
        id: debt.id,
        type: 'supplier',
        entityId: debt.supplier.id,
        entityName: debt.supplier.name,
        amount: debt.amount,
        dueDate: debt.dueDate,
        daysUntilDue: -daysOverdue,
        isOverdue: true,
        alertType: 'overdue',
      };

      await this.sendDebtAlert(alert);
    }
  }

  private async sendDebtAlert(alert: DebtAlert) {
    try {
      const channelName = 'debt-alerts';
      const eventName = 'debt-alert';

      await this.notificationService.pusher.trigger(channelName, eventName, {
        ...alert,
        dueDate: alert.dueDate.toISOString(),
        timestamp: new Date().toISOString(),
      });

      this.logger.log(
        `Debt alert sent for ${alert.type} ${alert.entityName}: ${alert.alertType}`,
      );
    } catch (error) {
      this.logger.error('Error sending debt alert:', error);
    }
  }

  private async markAlertAsSent(debtId: number, type: 'customer' | 'supplier') {
    try {
      if (type === 'customer') {
        await this.prisma.debt.update({
          where: { id: debtId },
          data: { alertSent: true },
        });
      } else {
        await this.prisma.supplierDebt.update({
          where: { id: debtId },
          data: { alertSent: true },
        });
      }
    } catch (error) {
      this.logger.error(`Error marking ${type} debt alert as sent:`, error);
    }
  }

  /**
   * Manually trigger debt alerts for testing
   */
  async triggerDebtAlerts() {
    this.logger.log('Manually triggering debt alerts...');
    await this.checkDebtAlerts();
  }

  /**
   * Reset alert flags for testing
   */
  async resetAlertFlags() {
    await Promise.all([
      this.prisma.debt.updateMany({
        where: { alertSent: true },
        data: { alertSent: false },
      }),
      this.prisma.supplierDebt.updateMany({
        where: { alertSent: true },
        data: { alertSent: false },
      }),
    ]);
    this.logger.log('Alert flags reset successfully');
  }
}
