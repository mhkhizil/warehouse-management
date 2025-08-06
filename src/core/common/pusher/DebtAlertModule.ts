import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DebtAlertService } from './DebtAlertService';
import { NotificationService } from './NotificationService';

import { DebtAlertsController } from '@src/application/controller/debt-alerts.controller';
import { PrismaModule } from '@src/application/module/prisma.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  controllers: [DebtAlertsController],
  providers: [DebtAlertService, NotificationService],
  exports: [DebtAlertService, NotificationService],
})
export class DebtAlertModule {}
