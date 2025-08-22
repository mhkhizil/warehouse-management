import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/core/common/prisma/PrismaService';
import { DebtAlertService } from '../src/core/common/pusher/DebtAlertService';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const prisma = app.get(PrismaService);
  const alerts = app.get(DebtAlertService);

  // Setup: create a test customer and supplier
  const testSuffix = `ALERT_TEST_${Date.now()}`;

  const customer = await prisma.customer.create({
    data: {
      name: `Test Customer ${testSuffix}`,
      email: `test.customer.${testSuffix}@example.com`,
      phone: `+1000${Math.floor(Math.random() * 1000000)}`,
    },
  });

  const supplier = await prisma.supplier.create({
    data: {
      name: `Test Supplier ${testSuffix}`,
      email: `test.supplier.${testSuffix}@example.com`,
      phone: `+2000${Math.floor(Math.random() * 1000000)}`,
    },
  });

  const now = new Date();
  const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    10,
    0,
    0,
  );
  const yesterday = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

  // Clean slate for flags
  await alerts.resetAlertFlags();

  // Seed debts: approaching, due, overdue (customer + supplier)
  const approachingDebt = await prisma.debt.create({
    data: {
      customerId: customer.id,
      amount: 100,
      dueDate: inTwoDays,
      isSettled: false,
      approachingAlertSent: false,
      dueAlertSent: false,
      alertSent: false,
    },
  });

  const dueDebt = await prisma.debt.create({
    data: {
      customerId: customer.id,
      amount: 200,
      dueDate: today,
      isSettled: false,
      approachingAlertSent: false,
      dueAlertSent: false,
      alertSent: false,
    },
  });

  const overdueDebt = await prisma.debt.create({
    data: {
      customerId: customer.id,
      amount: 300,
      dueDate: yesterday,
      isSettled: false,
      approachingAlertSent: false,
      dueAlertSent: false,
      alertSent: false,
    },
  });

  const approachingSupplierDebt = await prisma.supplierDebt.create({
    data: {
      supplierId: supplier.id,
      amount: 150,
      dueDate: inTwoDays,
      isSettled: false,
      approachingAlertSent: false,
      dueAlertSent: false,
      alertSent: false,
    },
  });

  const dueSupplierDebt = await prisma.supplierDebt.create({
    data: {
      supplierId: supplier.id,
      amount: 250,
      dueDate: today,
      isSettled: false,
      approachingAlertSent: false,
      dueAlertSent: false,
      alertSent: false,
    },
  });

  const overdueSupplierDebt = await prisma.supplierDebt.create({
    data: {
      supplierId: supplier.id,
      amount: 350,
      dueDate: yesterday,
      isSettled: false,
      approachingAlertSent: false,
      dueAlertSent: false,
      alertSent: false,
    },
  });

  // Trigger alerts
  await alerts.triggerDebtAlerts();

  // Fetch back to verify flags
  const freshApproachingDebt = await prisma.debt.findUnique({
    where: { id: approachingDebt.id },
    select: {
      id: true,
      approachingAlertSent: true,
      dueAlertSent: true,
      alertSent: true,
    },
  });

  const freshDueDebt = await prisma.debt.findUnique({
    where: { id: dueDebt.id },
    select: {
      id: true,
      approachingAlertSent: true,
      dueAlertSent: true,
      alertSent: true,
    },
  });

  const freshApproachingSupplierDebt = await prisma.supplierDebt.findUnique({
    where: { id: approachingSupplierDebt.id },
    select: {
      id: true,
      approachingAlertSent: true,
      dueAlertSent: true,
      alertSent: true,
    },
  });

  const freshDueSupplierDebt = await prisma.supplierDebt.findUnique({
    where: { id: dueSupplierDebt.id },
    select: {
      id: true,
      approachingAlertSent: true,
      dueAlertSent: true,
      alertSent: true,
    },
  });

  // Also exercise overdue flow (doesn't set flags, but should not throw)
  await alerts.checkOverdueDebts();

  console.log('Customer approaching debt flags:', freshApproachingDebt);
  console.log('Customer due debt flags:', freshDueDebt);
  console.log('Supplier approaching debt flags:', freshApproachingSupplierDebt);
  console.log('Supplier due debt flags:', freshDueSupplierDebt);

  // Cleanup test data
  await prisma.supplierDebt.deleteMany({ where: { supplierId: supplier.id } });
  await prisma.debt.deleteMany({ where: { customerId: customer.id } });
  await prisma.supplier.delete({ where: { id: supplier.id } });
  await prisma.customer.delete({ where: { id: customer.id } });

  await app.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


