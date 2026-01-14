const { PrismaClient } = require('@prisma/client');
const path = require('path');

async function main() {
    // Import compiled service from dist to avoid ts-node path issues
    const { DebtAlertService } = require(path.join(
        __dirname,
        '..',
        'dist',
        'core',
        'common',
        'pusher',
        'DebtAlertService.js',
    ));

    const prisma = new PrismaClient();

    // Stub notification service with a fake pusher
    const notificationService = {
        pusher: {
            trigger: async (channel, event, payload) => {
                console.log('[PUSHER]', { channel, event, payload });
            },
        },
    };

    const alerts = new DebtAlertService(prisma, notificationService);

    const testSuffix = `ALERT_TEST_${Date.now()}`;

    // Create customer and supplier
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
    // Set a due time a couple of hours ahead today to trigger the 'due' path (not overdue)
    const today = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const yesterday = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

    // Ensure flags are false for all new rows
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

    // Trigger checks
    await alerts.checkDebtAlerts();
    await alerts.checkOverdueDebts();

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

    console.log('Customer approaching debt flags:', freshApproachingDebt);
    console.log('Customer due debt flags:', freshDueDebt);
    console.log('Supplier approaching debt flags:', freshApproachingSupplierDebt);
    console.log('Supplier due debt flags:', freshDueSupplierDebt);

    // Cleanup
    await prisma.supplierDebt.deleteMany({ where: { supplierId: supplier.id } });
    await prisma.debt.deleteMany({ where: { customerId: customer.id } });
    await prisma.supplier.delete({ where: { id: supplier.id } });
    await prisma.customer.delete({ where: { id: customer.id } });

    await prisma.$disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});


