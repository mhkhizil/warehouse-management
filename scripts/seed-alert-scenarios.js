const { PrismaClient } = require('@prisma/client');

async function main() {
    const prisma = new PrismaClient();

    try {
        const now = new Date();
        const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // approaching (<= 3 days)
        const dueLaterToday = new Date(now.getTime() + 2 * 60 * 60 * 1000); // due today (not overdue)
        const yesterday = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000); // overdue

        const tag = `SEED_ALERT_${Date.now()}`;

        // Create customer and supplier anchors
        const customer = await prisma.customer.create({
            data: {
                name: `Seed Customer ${tag}`,
                email: `seed.customer.${tag}@example.com`,
                phone: `+1${Math.floor(Math.random() * 1_000_000_000)}`,
            },
        });

        const supplier = await prisma.supplier.create({
            data: {
                name: `Seed Supplier ${tag}`,
                email: `seed.supplier.${tag}@example.com`,
                phone: `+2${Math.floor(Math.random() * 1_000_000_000)}`,
            },
        });

        // Customer debts
        const customerApproaching = await prisma.debt.create({
            data: {
                customerId: customer.id,
                amount: 123.45,
                dueDate: inTwoDays,
                remarks: `approaching (${tag})`,
                isSettled: false,
                approachingAlertSent: false,
                dueAlertSent: false,
                alertSent: false,
            },
        });

        const customerDue = await prisma.debt.create({
            data: {
                customerId: customer.id,
                amount: 234.56,
                dueDate: dueLaterToday,
                remarks: `due (${tag})`,
                isSettled: false,
                approachingAlertSent: false,
                dueAlertSent: false,
                alertSent: false,
            },
        });

        const customerOverdue = await prisma.debt.create({
            data: {
                customerId: customer.id,
                amount: 345.67,
                dueDate: yesterday,
                remarks: `overdue (${tag})`,
                isSettled: false,
                approachingAlertSent: false,
                dueAlertSent: false,
                alertSent: false,
            },
        });

        // Supplier debts
        const supplierApproaching = await prisma.supplierDebt.create({
            data: {
                supplierId: supplier.id,
                amount: 111.11,
                dueDate: inTwoDays,
                remarks: `approaching (${tag})`,
                isSettled: false,
                approachingAlertSent: false,
                dueAlertSent: false,
                alertSent: false,
            },
        });

        const supplierDue = await prisma.supplierDebt.create({
            data: {
                supplierId: supplier.id,
                amount: 222.22,
                dueDate: dueLaterToday,
                remarks: `due (${tag})`,
                isSettled: false,
                approachingAlertSent: false,
                dueAlertSent: false,
                alertSent: false,
            },
        });

        const supplierOverdue = await prisma.supplierDebt.create({
            data: {
                supplierId: supplier.id,
                amount: 333.33,
                dueDate: yesterday,
                remarks: `overdue (${tag})`,
                isSettled: false,
                approachingAlertSent: false,
                dueAlertSent: false,
                alertSent: false,
            },
        });

        console.log('Seeded customer:', customer);
        console.log('Seeded supplier:', supplier);
        console.log('Customer debts:', {
            approaching: customerApproaching.id,
            due: customerDue.id,
            overdue: customerOverdue.id,
        });
        console.log('Supplier debts:', {
            approaching: supplierApproaching.id,
            due: supplierDue.id,
            overdue: supplierOverdue.id,
        });

        console.log('\nUse these IDs to test alerts. Records are persisted.');
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});





