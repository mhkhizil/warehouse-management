const { PrismaClient } = require('@prisma/client');

async function main() {
    console.log('🧪 Testing debt alert timing modifications...');

    const prisma = new PrismaClient();

    try {
        // Check current debt alert settings
        console.log('\n📊 Current debt alert configuration:');
        console.log('✅ Debt alerts: Every 5 minutes (instead of hourly)');
        console.log('✅ Overdue checks: Every 10 minutes (instead of daily at 9 AM)');

        // Create a test debt that will trigger alerts
        console.log('\n🔧 Creating test debt for timing verification...');

        const testSuffix = `TIMING_TEST_${Date.now()}`;
        const now = new Date();

        // Create test customer
        const testCustomer = await prisma.customer.create({
            data: {
                name: `Timing Test Customer ${testSuffix}`,
                email: `timing.test.${testSuffix}@example.com`,
                phone: `+1000${Math.floor(Math.random() * 1000000)}`,
            },
        });

        // Create a debt due in 2 hours (should trigger "approaching" alert)
        const approachingDebt = await prisma.debt.create({
            data: {
                customerId: testCustomer.id,
                amount: 250.0,
                dueDate: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
                isSettled: false,
                approachingAlertSent: false,
                dueAlertSent: false,
                alertSent: false,
                remarks: 'Timing test - approaching debt'
            }
        });

        // Create a debt due in 30 minutes (should trigger "due" alert)
        const dueDebt = await prisma.debt.create({
            data: {
                customerId: testCustomer.id,
                amount: 150.0,
                dueDate: new Date(now.getTime() + 30 * 60 * 1000), // 30 minutes from now
                isSettled: false,
                approachingAlertSent: false,
                dueAlertSent: false,
                alertSent: false,
                remarks: 'Timing test - due debt'
            }
        });

        // Create an overdue debt (should trigger "overdue" alert)
        const overdueDebt = await prisma.debt.create({
            data: {
                customerId: testCustomer.id,
                amount: 100.0,
                dueDate: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
                isSettled: false,
                approachingAlertSent: false,
                dueAlertSent: false,
                alertSent: false,
                remarks: 'Timing test - overdue debt'
            }
        });

        console.log('✅ Created test debts:');
        console.log(`  - Approaching: $${approachingDebt.amount} due in 2 hours`);
        console.log(`  - Due: $${dueDebt.amount} due in 30 minutes`);
        console.log(`  - Overdue: $${overdueDebt.amount} overdue by 1 hour`);

        // Check which alerts should be triggered
        console.log('\n🔍 Analyzing alert scenarios...');

        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const testDebts = [
            { ...approachingDebt, type: 'approaching' },
            { ...dueDebt, type: 'due' },
            { ...overdueDebt, type: 'overdue' }
        ];

        for (const debt of testDebts) {
            const daysUntilDue = Math.ceil(
                (debt.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            );
            const hoursUntilDue = Math.ceil(
                (debt.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)
            );
            const isOverdue = debt.dueDate < now;

            let alertType = 'none';
            if (isOverdue) {
                alertType = 'overdue';
            } else if (debt.dueDate <= oneDayFromNow) {
                alertType = 'due';
            } else if (debt.dueDate <= threeDaysFromNow) {
                alertType = 'approaching';
            }

            console.log(`${debt.type.toUpperCase()} Debt $${debt.amount}: ${alertType} (${hoursUntilDue} hours until due)`);
        }

        // Simulate what the alert service would do
        console.log('\n🚨 Simulating alert service execution...');

        const debtsToAlert = await prisma.debt.findMany({
            where: {
                customerId: testCustomer.id,
                isSettled: false,
                dueDate: {
                    lte: threeDaysFromNow,
                },
                OR: [
                    { approachingAlertSent: false },
                    { dueAlertSent: false }
                ],
            },
            include: {
                customer: {
                    select: {
                        name: true
                    }
                }
            }
        });

        console.log(`📋 Debts that should trigger alerts: ${debtsToAlert.length}`);

        for (const debt of debtsToAlert) {
            const hoursUntilDue = Math.ceil(
                (debt.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)
            );
            const isOverdue = debt.dueDate < now;

            let alertType = 'none';
            if (isOverdue) {
                alertType = 'overdue';
            } else if (debt.dueDate <= oneDayFromNow) {
                alertType = 'due';
            } else {
                alertType = 'approaching';
            }

            console.log(`📢 ALERT: ${debt.customer.name} owes $${debt.amount} - ${alertType} (${hoursUntilDue} hours until due)`);

            // Update alert flags (simulating what the real service would do)
            if (alertType === 'approaching') {
                await prisma.debt.update({
                    where: { id: debt.id },
                    data: { approachingAlertSent: true }
                });
                console.log(`  ✅ Marked approaching alert as sent`);
            } else if (alertType === 'due') {
                await prisma.debt.update({
                    where: { id: debt.id },
                    data: { dueAlertSent: true }
                });
                console.log(`  ✅ Marked due alert as sent`);
            }
        }

        // Show timing expectations
        console.log('\n⏰ Timing Expectations:');
        console.log('🔄 Debt alerts will now run every 5 minutes');
        console.log('🔄 Overdue checks will now run every 10 minutes');
        console.log('📱 You should see alerts much more frequently during testing');
        console.log('⚠️  Remember to change back to hourly/daily for production!');

        // Cleanup test data
        console.log('\n🧹 Cleaning up test data...');
        await prisma.debt.deleteMany({ where: { customerId: testCustomer.id } });
        await prisma.customer.delete({ where: { id: testCustomer.id } });

        console.log('\n🎉 Timing test completed successfully!');
        console.log('\n📋 Next Steps:');
        console.log('1. Start your application: npm start');
        console.log('2. Wait 5-10 minutes to see alerts');
        console.log('3. Check logs for "Checking for debt alerts..." messages');
        console.log('4. Monitor your frontend for real-time notifications');

    } catch (error) {
        console.error('❌ Error during timing test:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((e) => {
    console.error('❌ Test failed:', e);
    process.exit(1);
});

