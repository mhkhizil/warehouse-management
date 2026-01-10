import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
import {
  TransactionType,
  PaymentMethod,
  RefundType,
  RefundStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create root admin user
  const hashedPassword = await hash('root123456789');

  const rootUser = await prisma.user.upsert({
    where: { email: 'root@gmail.com' },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      username: 'root',
      email: 'root@gmail.com',
      password: hashedPassword,
      phone: '0000000000',
      role: 'ADMIN',
    },
  });

  console.log('✅ Root admin user created:', rootUser.username);

  // Create additional staff users
  const staffUsers = [
    {
      username: 'john_tech',
      email: 'john.tech@autoparts.com',
      phone: '+12345678901',
      role: 'STAFF' as const,
      fullName: 'John Technician',
      permissions: {
        canEditItems: true,
        canViewReports: true,
        canProcessTransactions: true,
        canManageStock: true,
      },
    },
    {
      username: 'sarah_sales',
      email: 'sarah.sales@autoparts.com',
      phone: '+12345678902',
      role: 'STAFF' as const,
      fullName: 'Sarah Sales',
      permissions: {
        canEditItems: false,
        canViewReports: true,
        canProcessTransactions: true,
        canManageStock: false,
      },
    },
    {
      username: 'mike_inventory',
      email: 'mike.inventory@autoparts.com',
      phone: '+12345678903',
      role: 'STAFF' as const,
      fullName: 'Mike Inventory',
      permissions: {
        canEditItems: true,
        canViewReports: false,
        canProcessTransactions: false,
        canManageStock: true,
      },
    },
    {
      username: 'lisa_admin',
      email: 'lisa.admin@autoparts.com',
      phone: '+12345678904',
      role: 'STAFF' as const,
      fullName: 'Lisa Administrator',
      permissions: {
        canEditItems: true,
        canViewReports: true,
        canProcessTransactions: true,
        canManageStock: true,
      },
    },
  ];

  for (const staffData of staffUsers) {
    const hashedStaffPassword = await hash('staff123456');

    const user = await prisma.user.upsert({
      where: { username: staffData.username },
      update: {
        password: hashedStaffPassword,
        email: staffData.email,
        phone: staffData.phone,
        role: staffData.role,
        staffData: {
          upsert: {
            create: {
              fullName: staffData.fullName,
              phone: staffData.phone,
              permissions: staffData.permissions,
            },
            update: {
              fullName: staffData.fullName,
              phone: staffData.phone,
              permissions: staffData.permissions,
            },
          },
        },
      },
      create: {
        username: staffData.username,
        email: staffData.email,
        password: hashedStaffPassword,
        phone: staffData.phone,
        role: staffData.role,
        staffData: {
          create: {
            fullName: staffData.fullName,
            phone: staffData.phone,
            permissions: staffData.permissions,
          },
        },
      },
    });
    console.log(`✅ Staff user created/updated: ${user.username}`);
  }

  // Create suppliers
  const suppliers = [
    {
      name: 'AutoZone Parts Co.',
      phone: '+19876543210',
      email: 'orders@autozone.com',
      address: '123 Industrial Blvd, Detroit, MI 48201',
      contactPerson: 'Robert Johnson',
      remarks: 'Primary supplier for engine parts and accessories',
    },
    {
      name: 'CarParts Express',
      phone: '+19876543211',
      email: 'supply@carpartsexpress.com',
      address: '456 Warehouse Dr, Chicago, IL 60601',
      contactPerson: 'Maria Rodriguez',
      remarks: 'Specialized in transmission and brake components',
    },
    {
      name: 'Motor Masters Supply',
      phone: '+19876543212',
      email: 'info@motormasters.com',
      address: '789 Auto Parts Way, Los Angeles, CA 90001',
      contactPerson: 'David Chen',
      remarks: 'High-quality OEM replacement parts',
    },
    {
      name: 'Quick Parts Solutions',
      phone: '+19876543213',
      email: 'sales@quickparts.com',
      address: '321 Fast Lane, Houston, TX 77001',
      contactPerson: 'Jennifer Smith',
      remarks: 'Fast delivery for urgent parts needs',
    },
    {
      name: 'Premium Auto Components',
      phone: '+19876543214',
      email: 'orders@premiumauto.com',
      address: '654 Quality St, Miami, FL 33101',
      contactPerson: 'Carlos Martinez',
      remarks: 'Premium and performance parts supplier',
    },
    {
      name: 'Budget Parts Warehouse',
      phone: '+19876543215',
      email: 'info@budgetparts.com',
      address: '987 Economy Ave, Phoenix, AZ 85001',
      contactPerson: 'Amanda Wilson',
      remarks: 'Cost-effective parts for budget-conscious customers',
    },
    {
      name: 'European Parts Specialists',
      phone: '+19876543216',
      email: 'sales@europarts.com',
      address: '147 Import Blvd, Seattle, WA 98101',
      contactPerson: 'Hans Mueller',
      remarks: 'Specialized in European vehicle parts',
    },
    {
      name: 'Truck Parts Unlimited',
      phone: '+19876543217',
      email: 'orders@truckparts.com',
      address: '258 Heavy Duty Rd, Denver, CO 80201',
      contactPerson: 'Tom Anderson',
      remarks: 'Heavy truck and commercial vehicle parts',
    },
  ];

  for (const supplierData of suppliers) {
    // Use email as unique identifier if available, otherwise phone
    const uniqueField = supplierData.email
      ? { email: supplierData.email }
      : { phone: supplierData.phone };

    if (uniqueField.email || uniqueField.phone) {
      const supplier = await prisma.supplier.upsert({
        where: uniqueField,
        update: supplierData,
        create: supplierData,
      });
      console.log(`✅ Supplier created/updated: ${supplier.name}`);
    } else {
      // If no unique field, just create
      const supplier = await prisma.supplier.create({
        data: supplierData,
      });
      console.log(`✅ Supplier created: ${supplier.name}`);
    }
  }

  // Create customers
  const customers = [
    {
      name: "Mike's Auto Repair",
      phone: '+15551234567',
      email: 'mike@mikesautorepair.com',
      address: '123 Main St, Downtown, NY 10001',
    },
    {
      name: "Sarah's Car Care",
      phone: '+15551234568',
      email: 'sarah@sarahscarcare.com',
      address: '456 Oak Ave, Suburbia, CA 90210',
    },
    {
      name: 'Quick Fix Garage',
      phone: '+15551234569',
      email: 'info@quickfixgarage.com',
      address: '789 Speed Blvd, Fast City, TX 75001',
    },
    {
      name: 'Family Auto Service',
      phone: '+15551234570',
      email: 'service@familyauto.com',
      address: '321 Family Dr, Neighborhood, FL 33101',
    },
    {
      name: 'Professional Motors',
      phone: '+15551234571',
      email: 'service@professionalmotors.com',
      address: '654 Pro St, Business District, IL 60601',
    },
    {
      name: 'Budget Auto Solutions',
      phone: '+15551234572',
      email: 'info@budgetauto.com',
      address: '987 Economy Way, Budget Town, AZ 85001',
    },
    {
      name: 'Classic Car Restoration',
      phone: '+15551234573',
      email: 'restore@classiccars.com',
      address: '147 Vintage Lane, Heritage City, MI 48201',
    },
    {
      name: 'Truck & Fleet Service',
      phone: '+15551234574',
      email: 'fleet@truckfleet.com',
      address: '258 Commercial Blvd, Industrial Zone, WA 98101',
    },
    {
      name: 'Import Auto Specialists',
      phone: '+15551234575',
      email: 'service@importauto.com',
      address: '369 Import Way, International City, CA 90001',
    },
    {
      name: 'Mobile Auto Repair',
      phone: '+15551234576',
      email: 'mobile@autorepair.com',
      address: 'Mobile Service - Various Locations',
    },
    {
      name: 'Performance Tuning Shop',
      phone: '+15551234577',
      email: 'tune@performance.com',
      address: '741 Power St, Performance District, TX 75001',
    },
    {
      name: 'Emergency Roadside Service',
      phone: '+15551234578',
      email: 'emergency@roadside.com',
      address: '852 Emergency Ave, Service City, NY 10001',
    },
  ];

  for (const customerData of customers) {
    // Use email as unique identifier if available
    if (customerData.email) {
      const customer = await prisma.customer.upsert({
        where: { email: customerData.email },
        update: customerData,
        create: customerData,
      });
      console.log(`✅ Customer created/updated: ${customer.name}`);
    } else {
      // If no email, just create
      const customer = await prisma.customer.create({
        data: customerData,
      });
      console.log(`✅ Customer created: ${customer.name}`);
    }
  }

  // Create items (parent items and sub-items)
  console.log('🔧 Creating items...');

  // Parent items (main categories)
  const parentItems = [
    {
      name: 'Engine Parts',
      brand: 'General',
      type: 'Engine',
      price: 999.99, // Category bundle price
      isSellable: true,
      remarks:
        'Complete engine parts category bundle - includes pistons, camshaft, bearings, and more',
    },
    {
      name: 'Brake System',
      brand: 'General',
      type: 'Brakes',
      price: 599.99,
      isSellable: true,
      remarks:
        'Complete brake system package - includes pads, rotors, lines, and hardware',
    },
    {
      name: 'Transmission',
      brand: 'General',
      type: 'Transmission',
      price: 1299.99,
      isSellable: true,
      remarks:
        'Complete transmission package - includes clutch, flywheel, gears, and mounts',
    },
    {
      name: 'Suspension',
      brand: 'General',
      type: 'Suspension',
      price: 899.99,
      isSellable: true,
      remarks:
        'Complete suspension package - includes springs, shocks, sway bars, and bushings',
    },
    {
      name: 'Electrical',
      brand: 'General',
      type: 'Electrical',
      price: 799.99,
      isSellable: true,
      remarks:
        'Complete electrical package - includes ignition, battery, alternator, and starter',
    },
    {
      name: 'Body Parts',
      brand: 'General',
      type: 'Body',
      price: 1499.99,
      isSellable: true,
      remarks:
        'Complete body parts package - includes bumpers, hood, fenders, and mirrors',
    },
    {
      name: 'Interior',
      brand: 'General',
      type: 'Interior',
      price: 699.99,
      isSellable: true,
      remarks:
        'Complete interior package - includes seats, steering, shifters, and accessories',
    },
    {
      name: 'Exhaust System',
      brand: 'General',
      type: 'Exhaust',
      price: 899.99,
      isSellable: true,
      remarks:
        'Complete exhaust package - includes headers, muffler, catalytic converter, and tips',
    },
    {
      name: 'Cooling System',
      brand: 'General',
      type: 'Cooling',
      price: 649.99,
      isSellable: true,
      remarks:
        'Complete cooling package - includes radiator, water pump, thermostat, and fan',
    },
    {
      name: 'Fuel System',
      brand: 'General',
      type: 'Fuel',
      price: 749.99,
      isSellable: true,
      remarks:
        'Complete fuel package - includes pump, injectors, filter, regulator, and lines',
    },
  ];

  // Create parent items first
  const createdParentItems: any[] = [];
  for (const parentData of parentItems) {
    const parentItem = await prisma.item.create({
      data: parentData,
    });
    createdParentItems.push(parentItem);
    console.log(`✅ Parent item created: ${parentItem.name}`);
  }

  // Sub-items with realistic auto parts data
  const subItems = [
    // Engine Parts Sub-items
    {
      name: 'Piston Rings',
      brand: 'Mahle',
      type: 'Engine',
      price: 45.99,
      isSellable: true,
      parentItemId: createdParentItems[0].id,
      remarks: 'High-quality piston rings for engine rebuilds',
    },
    {
      name: 'Crankshaft Bearings',
      brand: 'Clevite',
      type: 'Engine',
      price: 89.99,
      isSellable: true,
      parentItemId: createdParentItems[0].id,
      remarks: 'Precision-engineered crankshaft bearings',
    },
    {
      name: 'Camshaft',
      brand: 'Comp Cams',
      type: 'Engine',
      price: 299.99,
      isSellable: true,
      parentItemId: createdParentItems[0].id,
      remarks: 'Performance camshaft for increased power',
    },
    {
      name: 'Valve Springs',
      brand: 'Pac Racing',
      type: 'Engine',
      price: 129.99,
      isSellable: true,
      parentItemId: createdParentItems[0].id,
      remarks: 'High-performance valve springs',
    },
    {
      name: 'Oil Pump',
      brand: 'Melling',
      type: 'Engine',
      price: 189.99,
      isSellable: true,
      parentItemId: createdParentItems[0].id,
      remarks: 'High-volume oil pump for performance engines',
    },

    // Brake System Sub-items
    {
      name: 'Brake Pads (Front)',
      brand: 'Hawk Performance',
      type: 'Brakes',
      price: 79.99,
      isSellable: true,
      parentItemId: createdParentItems[1].id,
      remarks: 'Performance brake pads for front wheels',
    },
    {
      name: 'Brake Pads (Rear)',
      brand: 'Hawk Performance',
      type: 'Brakes',
      price: 69.99,
      isSellable: true,
      parentItemId: createdParentItems[1].id,
      remarks: 'Performance brake pads for rear wheels',
    },
    {
      name: 'Brake Rotors (Front)',
      brand: 'DBA',
      type: 'Brakes',
      price: 149.99,
      isSellable: true,
      parentItemId: createdParentItems[1].id,
      remarks: 'Slotted and drilled front brake rotors',
    },
    {
      name: 'Brake Rotors (Rear)',
      brand: 'DBA',
      type: 'Brakes',
      price: 129.99,
      isSellable: true,
      parentItemId: createdParentItems[1].id,
      remarks: 'Slotted and drilled rear brake rotors',
    },
    {
      name: 'Brake Lines',
      brand: 'Goodridge',
      type: 'Brakes',
      price: 89.99,
      isSellable: true,
      parentItemId: createdParentItems[1].id,
      remarks: 'Stainless steel braided brake lines',
    },

    // Transmission Sub-items
    {
      name: 'Clutch Kit',
      brand: 'Exedy',
      type: 'Transmission',
      price: 399.99,
      isSellable: true,
      parentItemId: createdParentItems[2].id,
      remarks: 'Complete clutch kit with pressure plate and disc',
    },
    {
      name: 'Flywheel',
      brand: 'Fidanza',
      type: 'Transmission',
      price: 299.99,
      isSellable: true,
      parentItemId: createdParentItems[2].id,
      remarks: 'Lightweight aluminum flywheel',
    },
    {
      name: 'Gear Set',
      brand: 'GForce',
      type: 'Transmission',
      price: 899.99,
      isSellable: true,
      parentItemId: createdParentItems[2].id,
      remarks: 'Performance gear set for racing applications',
    },
    {
      name: 'Shift Fork',
      brand: 'Synchrotech',
      type: 'Transmission',
      price: 45.99,
      isSellable: true,
      parentItemId: createdParentItems[2].id,
      remarks: 'Replacement shift fork for manual transmissions',
    },
    {
      name: 'Transmission Mount',
      brand: 'Energy Suspension',
      type: 'Transmission',
      price: 29.99,
      isSellable: true,
      parentItemId: createdParentItems[2].id,
      remarks: 'Polyurethane transmission mount',
    },

    // Suspension Sub-items
    {
      name: 'Coil Springs',
      brand: 'Eibach',
      type: 'Suspension',
      price: 249.99,
      isSellable: true,
      parentItemId: createdParentItems[3].id,
      remarks: 'Lowering springs for improved handling',
    },
    {
      name: 'Shock Absorbers',
      brand: 'Koni',
      type: 'Suspension',
      price: 399.99,
      isSellable: true,
      parentItemId: createdParentItems[3].id,
      remarks: 'Adjustable shock absorbers',
    },
    {
      name: 'Sway Bar',
      brand: 'Whiteline',
      type: 'Suspension',
      price: 189.99,
      isSellable: true,
      parentItemId: createdParentItems[3].id,
      remarks: 'Adjustable rear sway bar',
    },
    {
      name: 'Control Arms',
      brand: 'SPC',
      type: 'Suspension',
      price: 159.99,
      isSellable: true,
      parentItemId: createdParentItems[3].id,
      remarks: 'Adjustable control arms for alignment',
    },
    {
      name: 'Bushings',
      brand: 'Energy Suspension',
      type: 'Suspension',
      price: 39.99,
      isSellable: true,
      parentItemId: createdParentItems[3].id,
      remarks: 'Polyurethane suspension bushings',
    },

    // Electrical Sub-items
    {
      name: 'Spark Plugs',
      brand: 'NGK',
      type: 'Electrical',
      price: 12.99,
      isSellable: true,
      parentItemId: createdParentItems[4].id,
      remarks: 'Iridium spark plugs for better ignition',
    },
    {
      name: 'Ignition Coils',
      brand: 'MSD',
      type: 'Electrical',
      price: 89.99,
      isSellable: true,
      parentItemId: createdParentItems[4].id,
      remarks: 'High-performance ignition coils',
    },
    {
      name: 'Battery',
      brand: 'Optima',
      type: 'Electrical',
      price: 199.99,
      isSellable: true,
      parentItemId: createdParentItems[4].id,
      remarks: 'Yellow top deep cycle battery',
    },
    {
      name: 'Alternator',
      brand: 'Denso',
      type: 'Electrical',
      price: 299.99,
      isSellable: true,
      parentItemId: createdParentItems[4].id,
      remarks: 'High-output alternator',
    },
    {
      name: 'Starter Motor',
      brand: 'Bosch',
      type: 'Electrical',
      price: 189.99,
      isSellable: true,
      parentItemId: createdParentItems[4].id,
      remarks: 'High-torque starter motor',
    },

    // Body Parts Sub-items
    {
      name: 'Front Bumper',
      brand: 'OEM',
      type: 'Body',
      price: 299.99,
      isSellable: true,
      parentItemId: createdParentItems[5].id,
      remarks: 'OEM replacement front bumper',
    },
    {
      name: 'Rear Bumper',
      brand: 'OEM',
      type: 'Body',
      price: 279.99,
      isSellable: true,
      parentItemId: createdParentItems[5].id,
      remarks: 'OEM replacement rear bumper',
    },
    {
      name: 'Hood',
      brand: 'Carbon Fiber',
      type: 'Body',
      price: 899.99,
      isSellable: true,
      parentItemId: createdParentItems[5].id,
      remarks: 'Carbon fiber hood for weight reduction',
    },
    {
      name: 'Fenders',
      brand: 'OEM',
      type: 'Body',
      price: 189.99,
      isSellable: true,
      parentItemId: createdParentItems[5].id,
      remarks: 'OEM replacement fenders',
    },
    {
      name: 'Side Mirrors',
      brand: 'OEM',
      type: 'Body',
      price: 149.99,
      isSellable: true,
      parentItemId: createdParentItems[5].id,
      remarks: 'Power side mirrors with turn signals',
    },

    // Interior Sub-items
    {
      name: 'Seat Covers',
      brand: 'Wet Okole',
      type: 'Interior',
      price: 199.99,
      isSellable: true,
      parentItemId: createdParentItems[6].id,
      remarks: 'Neoprene seat covers for protection',
    },
    {
      name: 'Steering Wheel',
      brand: 'Momo',
      type: 'Interior',
      price: 299.99,
      isSellable: true,
      parentItemId: createdParentItems[6].id,
      remarks: 'Sport steering wheel with quick release',
    },
    {
      name: 'Shift Knob',
      brand: 'B&M',
      type: 'Interior',
      price: 49.99,
      isSellable: true,
      parentItemId: createdParentItems[6].id,
      remarks: 'Aluminum shift knob for manual transmissions',
    },
    {
      name: 'Floor Mats',
      brand: 'WeatherTech',
      type: 'Interior',
      price: 89.99,
      isSellable: true,
      parentItemId: createdParentItems[6].id,
      remarks: 'Custom-fit all-weather floor mats',
    },
    {
      name: 'Dashboard Cover',
      brand: 'Covercraft',
      type: 'Interior',
      price: 79.99,
      isSellable: true,
      parentItemId: createdParentItems[6].id,
      remarks: 'Custom-fit dashboard cover for sun protection',
    },

    // Exhaust System Sub-items
    {
      name: 'Headers',
      brand: 'JBA',
      type: 'Exhaust',
      price: 399.99,
      isSellable: true,
      parentItemId: createdParentItems[7].id,
      remarks: 'Long-tube headers for increased power',
    },
    {
      name: 'Catalytic Converter',
      brand: 'Magnaflow',
      type: 'Exhaust',
      price: 299.99,
      isSellable: true,
      parentItemId: createdParentItems[7].id,
      remarks: 'High-flow catalytic converter',
    },
    {
      name: 'Muffler',
      brand: 'Flowmaster',
      type: 'Exhaust',
      price: 189.99,
      isSellable: true,
      parentItemId: createdParentItems[7].id,
      remarks: 'Performance muffler with aggressive sound',
    },
    {
      name: 'Exhaust Tips',
      brand: 'Gibson',
      type: 'Exhaust',
      price: 89.99,
      isSellable: true,
      parentItemId: createdParentItems[7].id,
      remarks: 'Stainless steel exhaust tips',
    },
    {
      name: 'Exhaust Gaskets',
      brand: 'Fel-Pro',
      type: 'Exhaust',
      price: 19.99,
      isSellable: true,
      parentItemId: createdParentItems[7].id,
      remarks: 'High-temperature exhaust gaskets',
    },

    // Cooling System Sub-items
    {
      name: 'Radiator',
      brand: 'Koyo',
      type: 'Cooling',
      price: 399.99,
      isSellable: true,
      parentItemId: createdParentItems[8].id,
      remarks: 'Aluminum radiator for better cooling',
    },
    {
      name: 'Water Pump',
      brand: 'Gates',
      type: 'Cooling',
      price: 89.99,
      isSellable: true,
      parentItemId: createdParentItems[8].id,
      remarks: 'High-performance water pump',
    },
    {
      name: 'Thermostat',
      brand: 'Stant',
      type: 'Cooling',
      price: 24.99,
      isSellable: true,
      parentItemId: createdParentItems[8].id,
      remarks: 'High-flow thermostat for better cooling',
    },
    {
      name: 'Cooling Fan',
      brand: 'Flex-a-lite',
      type: 'Cooling',
      price: 199.99,
      isSellable: true,
      parentItemId: createdParentItems[8].id,
      remarks: 'Electric cooling fan with controller',
    },
    {
      name: 'Hoses',
      brand: 'Gates',
      type: 'Cooling',
      price: 39.99,
      isSellable: true,
      parentItemId: createdParentItems[8].id,
      remarks: 'Silicone radiator hoses',
    },

    // Fuel System Sub-items
    {
      name: 'Fuel Pump',
      brand: 'Walbro',
      type: 'Fuel',
      price: 199.99,
      isSellable: true,
      parentItemId: createdParentItems[9].id,
      remarks: 'High-flow fuel pump for performance applications',
    },
    {
      name: 'Fuel Injectors',
      brand: 'Bosch',
      type: 'Fuel',
      price: 399.99,
      isSellable: true,
      parentItemId: createdParentItems[9].id,
      remarks: 'High-flow fuel injectors',
    },
    {
      name: 'Fuel Filter',
      brand: 'Mann',
      type: 'Fuel',
      price: 19.99,
      isSellable: true,
      parentItemId: createdParentItems[9].id,
      remarks: 'High-quality fuel filter',
    },
    {
      name: 'Fuel Pressure Regulator',
      brand: 'Aeromotive',
      type: 'Fuel',
      price: 89.99,
      isSellable: true,
      parentItemId: createdParentItems[9].id,
      remarks: 'Adjustable fuel pressure regulator',
    },
    {
      name: 'Fuel Lines',
      brand: "Earl's",
      type: 'Fuel',
      price: 69.99,
      isSellable: true,
      parentItemId: createdParentItems[9].id,
      remarks: 'Stainless steel braided fuel lines',
    },
  ];

  // Create sub-items
  for (const subItemData of subItems) {
    const subItem = await prisma.item.create({
      data: subItemData,
    });
    console.log(`✅ Sub-item created: ${subItem.name} (${subItem.brand})`);
  }

  // Create stock records for all items (both parent and sub-items)
  console.log('📦 Creating stock records...');

  // Create stock for parent items (category bundles)
  for (const parentItem of createdParentItems) {
    await prisma.stock.create({
      data: {
        itemId: parentItem.id,
        quantity: Math.floor(Math.random() * 20) + 5, // Random quantity between 5-25
        refillAlert: Math.random() > 0.7, // 30% chance of refill alert
      },
    });
    console.log(`✅ Stock created for parent item: ${parentItem.name}`);
  }

  // Create stock for sub-items (individual parts)
  const allSubItems = await prisma.item.findMany({
    where: { parentItemId: { not: null } },
  });

  for (const subItem of allSubItems) {
    await prisma.stock.create({
      data: {
        itemId: subItem.id,
        quantity: Math.floor(Math.random() * 50) + 10, // Random quantity between 10-60
        refillAlert: Math.random() > 0.8, // 20% chance of refill alert
      },
    });
    console.log(`✅ Stock created for sub-item: ${subItem.name}`);
  }

  // Create payment accounts
  console.log('💳 Creating payment accounts...');

  const paymentAccounts = [
    {
      accountName: 'Main Business Bank Account',
      accountType: 'Bank Account',
      accountNumber: '1234567890',
      bankName: 'First National Bank',
      accountHolder: 'Car Auto Parts WMS',
      description: 'Primary business account for all transactions',
      isActive: true,
      balance: 25000.0,
    },
    {
      accountName: 'Backup Business Account',
      accountType: 'Bank Account',
      accountNumber: '0987654321',
      bankName: 'City Commerce Bank',
      accountHolder: 'Car Auto Parts WMS',
      description: 'Secondary account for backup transactions',
      isActive: true,
      balance: 15000.0,
    },
    {
      accountName: 'Digital Wallet - PayPal',
      accountType: 'Digital Wallet',
      accountNumber: 'paypal@autoparts.com',
      bankName: 'PayPal',
      accountHolder: 'Car Auto Parts WMS',
      description: 'PayPal business account for online transactions',
      isActive: true,
      balance: 5000.0,
    },
    {
      accountName: 'Credit Card Account',
      accountType: 'Credit Card',
      accountNumber: '****-****-****-1234',
      bankName: 'Chase Bank',
      accountHolder: 'Car Auto Parts WMS',
      description: 'Business credit card for emergency purchases',
      isActive: true,
      balance: 10000.0,
    },
    {
      accountName: 'Cash Management Account',
      accountType: 'Bank Account',
      accountNumber: '555566667777',
      bankName: 'Wells Fargo',
      accountHolder: 'Car Auto Parts WMS',
      description: 'Account for managing cash flow and daily operations',
      isActive: true,
      balance: 8000.0,
    },
    {
      accountName: 'KBZ Pay Digital Wallet',
      accountType: 'Digital Wallet',
      accountNumber: '09-123456789',
      bankName: 'KBZ Bank',
      accountHolder: 'Car Auto Parts WMS',
      description: 'KBZ Pay digital wallet for mobile payments',
      isActive: true,
      balance: 12000.0,
    },
    {
      accountName: 'KBZ Mobile Banking',
      accountType: 'Bank Account',
      accountNumber: '123-456-789-012',
      bankName: 'KBZ Bank',
      accountHolder: 'Car Auto Parts WMS',
      description: 'KBZ mobile banking account for online transactions',
      isActive: true,
      balance: 18000.0,
    },
    {
      accountName: 'Wave Pay Digital Wallet',
      accountType: 'Digital Wallet',
      accountNumber: '09-987654321',
      bankName: 'Wave Money',
      accountHolder: 'Car Auto Parts WMS',
      description: 'Wave Pay digital wallet for mobile payments',
      isActive: true,
      balance: 8000.0,
    },
    {
      accountName: 'AYA Pay Digital Wallet',
      accountType: 'Digital Wallet',
      accountNumber: '09-555666777',
      bankName: 'AYA Bank',
      accountHolder: 'Car Auto Parts WMS',
      description: 'AYA Pay digital wallet for mobile payments',
      isActive: true,
      balance: 6000.0,
    },
    {
      accountName: 'KBZ Credit Card',
      accountType: 'Credit Card',
      accountNumber: '****-****-****-5678',
      bankName: 'KBZ Bank',
      accountHolder: 'Car Auto Parts WMS',
      description: 'KBZ Bank business credit card',
      isActive: true,
      balance: 15000.0,
    },
  ];

  const createdPaymentAccounts: any[] = [];
  for (const accountData of paymentAccounts) {
    const paymentAccount = await prisma.paymentAccount.create({
      data: accountData,
    });
    createdPaymentAccounts.push(paymentAccount);
    console.log(`✅ Payment account created: ${paymentAccount.accountName}`);
  }

  // Create transaction buy seed data
  console.log('🛒 Creating transaction buy seed data...');

  const buyTransactions = [
    {
      type: TransactionType.BUY,
      supplierId: 1, // AutoZone Parts Co.
      items: [
        { itemId: 11, quantity: 20, unitPrice: 45.99 }, // Piston Rings
        { itemId: 12, quantity: 15, unitPrice: 89.99 }, // Crankshaft Bearings
        { itemId: 13, quantity: 8, unitPrice: 299.99 }, // Camshaft
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[0].id, // Main Business Bank Account
      createSupplierDebt: false,
    },
    {
      type: TransactionType.BUY,
      supplierId: 2, // CarParts Express
      items: [
        { itemId: 16, quantity: 25, unitPrice: 79.99 }, // Brake Pads (Front)
        { itemId: 17, quantity: 20, unitPrice: 69.99 }, // Brake Pads (Rear)
        { itemId: 18, quantity: 12, unitPrice: 149.99 }, // Brake Rotors (Front)
      ],
      paymentMethod: PaymentMethod.HYBRID,
      paymentAccountId: createdPaymentAccounts[1].id, // Backup Business Account
      cashAmount: 1000.0,
      onlineAmount: 2499.75,
      createSupplierDebt: true,
      supplierDebt: {
        amount: 500.0,
        dueDate: new Date('2025-02-15'),
        remarks: 'Partial payment on credit terms',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.BUY,
      supplierId: 3, // Motor Masters Supply
      items: [
        { itemId: 21, quantity: 10, unitPrice: 399.99 }, // Clutch Kit
        { itemId: 22, quantity: 8, unitPrice: 299.99 }, // Flywheel
        { itemId: 23, quantity: 5, unitPrice: 899.99 }, // Gear Set
      ],
      paymentMethod: PaymentMethod.CASH,
      createSupplierDebt: false,
    },
    {
      type: TransactionType.BUY,
      supplierId: 4, // Quick Parts Solutions
      items: [
        { itemId: 26, quantity: 30, unitPrice: 249.99 }, // Coil Springs
        { itemId: 27, quantity: 15, unitPrice: 399.99 }, // Shock Absorbers
        { itemId: 28, quantity: 20, unitPrice: 189.99 }, // Sway Bar
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[5].id, // KBZ Pay Digital Wallet
      createSupplierDebt: true,
      supplierDebt: {
        amount: 2000.0,
        dueDate: new Date('2025-03-20'),
        remarks: 'Bulk order on extended payment terms',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.BUY,
      supplierId: 5, // Premium Auto Components
      items: [
        { itemId: 31, quantity: 50, unitPrice: 12.99 }, // Spark Plugs
        { itemId: 32, quantity: 25, unitPrice: 89.99 }, // Ignition Coils
        { itemId: 33, quantity: 10, unitPrice: 199.99 }, // Battery
      ],
      paymentMethod: PaymentMethod.HYBRID,
      paymentAccountId: createdPaymentAccounts[9].id, // KBZ Credit Card
      cashAmount: 500.0,
      onlineAmount: 1749.5,
      createSupplierDebt: false,
    },
    {
      type: TransactionType.BUY,
      supplierId: 6, // Budget Parts Warehouse
      items: [
        { itemId: 36, quantity: 15, unitPrice: 299.99 }, // Front Bumper
        { itemId: 37, quantity: 12, unitPrice: 279.99 }, // Rear Bumper
        { itemId: 38, quantity: 8, unitPrice: 899.99 }, // Hood
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[6].id, // KBZ Mobile Banking
      createSupplierDebt: true,
      supplierDebt: {
        amount: 1500.0,
        dueDate: new Date('2025-04-10'),
        remarks: 'Body parts order with payment plan',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.BUY,
      supplierId: 7, // European Parts Specialists
      items: [
        { itemId: 41, quantity: 20, unitPrice: 199.99 }, // Seat Covers
        { itemId: 42, quantity: 10, unitPrice: 299.99 }, // Steering Wheel
        { itemId: 43, quantity: 30, unitPrice: 49.99 }, // Shift Knob
      ],
      paymentMethod: PaymentMethod.CASH,
      createSupplierDebt: false,
    },
    {
      type: TransactionType.BUY,
      supplierId: 8, // Truck Parts Unlimited
      items: [
        { itemId: 46, quantity: 12, unitPrice: 399.99 }, // Headers
        { itemId: 47, quantity: 8, unitPrice: 299.99 }, // Catalytic Converter
        { itemId: 48, quantity: 15, unitPrice: 189.99 }, // Muffler
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[0].id, // Main Business Bank Account
      createSupplierDebt: false,
    },
    {
      type: TransactionType.BUY,
      supplierId: 1, // AutoZone Parts Co.
      items: [
        { itemId: 51, quantity: 25, unitPrice: 399.99 }, // Radiator
        { itemId: 52, quantity: 20, unitPrice: 89.99 }, // Water Pump
        { itemId: 53, quantity: 40, unitPrice: 24.99 }, // Thermostat
      ],
      paymentMethod: PaymentMethod.HYBRID,
      paymentAccountId: createdPaymentAccounts[1].id, // Backup Business Account
      cashAmount: 2000.0,
      onlineAmount: 10499.6,
      createSupplierDebt: true,
      supplierDebt: {
        amount: 3000.0,
        dueDate: new Date('2025-05-15'),
        remarks: 'Cooling system parts with extended payment',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.BUY,
      supplierId: 2, // CarParts Express
      items: [
        { itemId: 56, quantity: 15, unitPrice: 199.99 }, // Fuel Pump
        { itemId: 57, quantity: 10, unitPrice: 399.99 }, // Fuel Injectors
        { itemId: 58, quantity: 50, unitPrice: 19.99 }, // Fuel Filter
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[7].id, // Wave Pay Digital Wallet
      createSupplierDebt: false,
    },
    {
      type: TransactionType.BUY,
      supplierId: 3, // Motor Masters Supply
      items: [
        { itemId: 14, quantity: 30, unitPrice: 129.99 }, // Valve Springs
        { itemId: 15, quantity: 12, unitPrice: 189.99 }, // Oil Pump
        { itemId: 19, quantity: 18, unitPrice: 129.99 }, // Brake Rotors (Rear)
      ],
      paymentMethod: PaymentMethod.CASH,
      createSupplierDebt: true,
      supplierDebt: {
        amount: 800.0,
        dueDate: new Date('2025-06-01'),
        remarks: 'Engine and brake components on credit',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.BUY,
      supplierId: 4, // Quick Parts Solutions
      items: [
        { itemId: 20, quantity: 25, unitPrice: 89.99 }, // Brake Lines
        { itemId: 24, quantity: 20, unitPrice: 45.99 }, // Shift Fork
        { itemId: 25, quantity: 30, unitPrice: 29.99 }, // Transmission Mount
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[8].id, // AYA Pay Digital Wallet
      createSupplierDebt: false,
    },
    {
      type: TransactionType.BUY,
      supplierId: 5, // Premium Auto Components
      items: [
        { itemId: 29, quantity: 15, unitPrice: 159.99 }, // Control Arms
        { itemId: 30, quantity: 40, unitPrice: 39.99 }, // Bushings
        { itemId: 34, quantity: 8, unitPrice: 299.99 }, // Alternator
      ],
      paymentMethod: PaymentMethod.HYBRID,
      paymentAccountId: createdPaymentAccounts[5].id, // KBZ Pay Digital Wallet
      cashAmount: 1500.0,
      onlineAmount: 5199.65,
      createSupplierDebt: true,
      supplierDebt: {
        amount: 1000.0,
        dueDate: new Date('2025-07-20'),
        remarks: 'Suspension and electrical components',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.BUY,
      supplierId: 6, // Budget Parts Warehouse
      items: [
        { itemId: 35, quantity: 10, unitPrice: 189.99 }, // Starter Motor
        { itemId: 39, quantity: 15, unitPrice: 189.99 }, // Fenders
        { itemId: 40, quantity: 12, unitPrice: 149.99 }, // Side Mirrors
      ],
      paymentMethod: PaymentMethod.CASH,
      createSupplierDebt: false,
    },
    {
      type: TransactionType.BUY,
      supplierId: 7, // European Parts Specialists
      items: [
        { itemId: 44, quantity: 25, unitPrice: 89.99 }, // Floor Mats
        { itemId: 45, quantity: 20, unitPrice: 79.99 }, // Dashboard Cover
        { itemId: 49, quantity: 15, unitPrice: 89.99 }, // Exhaust Tips
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[0].id, // Main Business Bank Account
      createSupplierDebt: true,
      supplierDebt: {
        amount: 1200.0,
        dueDate: new Date('2025-08-30'),
        remarks: 'Interior and exhaust accessories',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.BUY,
      supplierId: 8, // Truck Parts Unlimited
      items: [
        { itemId: 50, quantity: 10, unitPrice: 19.99 }, // Exhaust Gaskets
        { itemId: 54, quantity: 15, unitPrice: 199.99 }, // Cooling Fan
        { itemId: 55, quantity: 30, unitPrice: 39.99 }, // Hoses
      ],
      paymentMethod: PaymentMethod.HYBRID,
      paymentAccountId: createdPaymentAccounts[1].id, // Backup Business Account
      cashAmount: 800.0,
      onlineAmount: 3999.7,
      createSupplierDebt: false,
    },
    {
      type: TransactionType.BUY,
      supplierId: 1, // AutoZone Parts Co.
      items: [
        { itemId: 59, quantity: 20, unitPrice: 89.99 }, // Fuel Pressure Regulator
        { itemId: 60, quantity: 25, unitPrice: 69.99 }, // Fuel Lines
        { itemId: 11, quantity: 15, unitPrice: 45.99 }, // Piston Rings (reorder)
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[7].id, // Wave Pay Digital Wallet
      createSupplierDebt: true,
      supplierDebt: {
        amount: 2500.0,
        dueDate: new Date('2025-09-15'),
        remarks: 'Fuel system components and engine parts',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.BUY,
      supplierId: 2, // CarParts Express
      items: [
        { itemId: 16, quantity: 30, unitPrice: 79.99 }, // Brake Pads (Front) - reorder
        { itemId: 17, quantity: 25, unitPrice: 69.99 }, // Brake Pads (Rear) - reorder
        { itemId: 18, quantity: 15, unitPrice: 149.99 }, // Brake Rotors (Front) - reorder
      ],
      paymentMethod: PaymentMethod.CASH,
      createSupplierDebt: false,
    },
    {
      type: TransactionType.BUY,
      supplierId: 3, // Motor Masters Supply
      items: [
        { itemId: 21, quantity: 12, unitPrice: 399.99 }, // Clutch Kit - reorder
        { itemId: 22, quantity: 10, unitPrice: 299.99 }, // Flywheel - reorder
        { itemId: 23, quantity: 6, unitPrice: 899.99 }, // Gear Set - reorder
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[9].id, // KBZ Credit Card
      createSupplierDebt: true,
      supplierDebt: {
        amount: 4000.0,
        dueDate: new Date('2025-10-20'),
        remarks: 'Transmission components with extended terms',
        isSettled: false,
        alertSent: false,
      },
    },
  ];

  // Create buy transactions
  for (const transactionData of buyTransactions) {
    // Calculate total amount
    const totalAmount = transactionData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        type: transactionData.type,
        supplierId: transactionData.supplierId,
        totalAmount: totalAmount,
        paymentMethod: transactionData.paymentMethod,
        paymentAccountId: transactionData.paymentAccountId,
        cashAmount: transactionData.cashAmount,
        onlineAmount: transactionData.onlineAmount,
        date: new Date(),
      },
    });

    // Create transaction items
    for (const itemData of transactionData.items) {
      await prisma.transactionItem.create({
        data: {
          transactionId: transaction.id,
          itemId: itemData.itemId,
          quantity: itemData.quantity,
          unitPrice: itemData.unitPrice,
          totalAmount: itemData.quantity * itemData.unitPrice,
        },
      });
    }

    // Create supplier debt if required
    if (transactionData.createSupplierDebt && transactionData.supplierDebt) {
      await prisma.supplierDebt.create({
        data: {
          supplierId: transactionData.supplierId,
          amount: transactionData.supplierDebt.amount,
          dueDate: transactionData.supplierDebt.dueDate,
          remarks: transactionData.supplierDebt.remarks,
          isSettled: transactionData.supplierDebt.isSettled,
          alertSent: transactionData.supplierDebt.alertSent,
          transactionId: transaction.id,
        },
      });
    }

    // Update stock quantities (increase for BUY transactions)
    for (const itemData of transactionData.items) {
      await prisma.stock.updateMany({
        where: { itemId: itemData.itemId },
        data: {
          quantity: {
            increment: itemData.quantity,
          },
        },
      });
    }

    console.log(
      `✅ Buy transaction created: ${transaction.id} - Total: $${totalAmount.toFixed(2)}`,
    );
  }

  // Create transaction sell seed data
  console.log('🛍️ Creating transaction sell seed data...');

  const sellTransactions = [
    {
      type: TransactionType.SELL,
      customerId: 1, // Mike's Auto Repair
      items: [
        {
          itemId: 11,
          quantity: 5,
          unitPrice: 45.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year manufacturer warranty',
        },
        {
          itemId: 12,
          quantity: 3,
          unitPrice: 89.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months engine parts warranty',
        },
        {
          itemId: 13,
          quantity: 1,
          unitPrice: 299.99,
          hasWarranty: true,
          warrantyDurationMonths: 24,
          warrantyDescription: '2 years performance warranty',
        },
      ],
      paymentMethod: PaymentMethod.CASH,
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 2, // Sarah's Car Care
      items: [
        {
          itemId: 16,
          quantity: 8,
          unitPrice: 79.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year brake system warranty',
        },
        {
          itemId: 17,
          quantity: 6,
          unitPrice: 69.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year brake system warranty',
        },
        {
          itemId: 18,
          quantity: 4,
          unitPrice: 149.99,
          hasWarranty: true,
          warrantyDurationMonths: 18,
          warrantyDescription: '18 months brake rotor warranty',
        },
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[5].id, // KBZ Pay Digital Wallet
      createDebt: true,
      debt: {
        amount: 500.0,
        dueDate: new Date('2025-02-15'),
        remarks: 'Partial payment on brake system upgrade',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.SELL,
      customerId: 3, // Quick Fix Garage
      items: [
        {
          itemId: 21,
          quantity: 2,
          unitPrice: 399.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year clutch warranty',
        },
        {
          itemId: 22,
          quantity: 1,
          unitPrice: 299.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year flywheel warranty',
        },
        {
          itemId: 23,
          quantity: 1,
          unitPrice: 899.99,
          hasWarranty: true,
          warrantyDurationMonths: 24,
          warrantyDescription: '2 years gear set warranty',
        },
      ],
      paymentMethod: PaymentMethod.HYBRID,
      paymentAccountId: createdPaymentAccounts[6].id, // KBZ Mobile Banking
      cashAmount: 1000.0,
      onlineAmount: 999.96,
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 4, // Family Auto Service
      items: [
        {
          itemId: 26,
          quantity: 4,
          unitPrice: 249.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year suspension warranty',
        },
        {
          itemId: 27,
          quantity: 2,
          unitPrice: 399.99,
          hasWarranty: true,
          warrantyDurationMonths: 18,
          warrantyDescription: '18 months shock absorber warranty',
        },
        {
          itemId: 28,
          quantity: 2,
          unitPrice: 189.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year sway bar warranty',
        },
      ],
      paymentMethod: PaymentMethod.CASH,
      createDebt: true,
      debt: {
        amount: 300.0,
        dueDate: new Date('2025-03-20'),
        remarks: 'Family discount payment plan',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.SELL,
      customerId: 5, // Professional Motors
      items: [
        {
          itemId: 31,
          quantity: 20,
          unitPrice: 12.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months spark plug warranty',
        },
        {
          itemId: 32,
          quantity: 8,
          unitPrice: 89.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year ignition coil warranty',
        },
        {
          itemId: 33,
          quantity: 3,
          unitPrice: 199.99,
          hasWarranty: true,
          warrantyDurationMonths: 24,
          warrantyDescription: '2 years battery warranty',
        },
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[7].id, // Wave Pay Digital Wallet
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 6, // Budget Auto Solutions
      items: [
        {
          itemId: 36,
          quantity: 2,
          unitPrice: 299.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year bumper warranty',
        },
        {
          itemId: 37,
          quantity: 2,
          unitPrice: 279.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year bumper warranty',
        },
        {
          itemId: 38,
          quantity: 1,
          unitPrice: 899.99,
          hasWarranty: true,
          warrantyDurationMonths: 24,
          warrantyDescription: '2 years carbon fiber hood warranty',
        },
      ],
      paymentMethod: PaymentMethod.HYBRID,
      paymentAccountId: createdPaymentAccounts[8].id, // AYA Pay Digital Wallet
      cashAmount: 800.0,
      onlineAmount: 1759.96,
      createDebt: true,
      debt: {
        amount: 1000.0,
        dueDate: new Date('2025-04-10'),
        remarks: 'Budget-friendly payment plan',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.SELL,
      customerId: 7, // Classic Car Restoration
      items: [
        {
          itemId: 41,
          quantity: 2,
          unitPrice: 199.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year seat cover warranty',
        },
        {
          itemId: 42,
          quantity: 1,
          unitPrice: 299.99,
          hasWarranty: true,
          warrantyDurationMonths: 18,
          warrantyDescription: '18 months steering wheel warranty',
        },
        {
          itemId: 43,
          quantity: 3,
          unitPrice: 49.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months shift knob warranty',
        },
      ],
      paymentMethod: PaymentMethod.CASH,
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 8, // Truck & Fleet Service
      items: [
        {
          itemId: 46,
          quantity: 3,
          unitPrice: 399.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year header warranty',
        },
        {
          itemId: 47,
          quantity: 2,
          unitPrice: 299.99,
          hasWarranty: true,
          warrantyDurationMonths: 18,
          warrantyDescription: '18 months catalytic converter warranty',
        },
        {
          itemId: 48,
          quantity: 4,
          unitPrice: 189.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year muffler warranty',
        },
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[9].id, // KBZ Credit Card
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 9, // Import Auto Specialists
      items: [
        {
          itemId: 51,
          quantity: 2,
          unitPrice: 399.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year radiator warranty',
        },
        {
          itemId: 52,
          quantity: 1,
          unitPrice: 89.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year water pump warranty',
        },
        {
          itemId: 53,
          quantity: 5,
          unitPrice: 24.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months thermostat warranty',
        },
      ],
      paymentMethod: PaymentMethod.HYBRID,
      paymentAccountId: createdPaymentAccounts[0].id, // Main Business Bank Account
      cashAmount: 500.0,
      onlineAmount: 524.94,
      createDebt: true,
      debt: {
        amount: 200.0,
        dueDate: new Date('2025-05-15'),
        remarks: 'Import specialist discount',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.SELL,
      customerId: 10, // Mobile Auto Repair
      items: [
        {
          itemId: 56,
          quantity: 1,
          unitPrice: 199.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year fuel pump warranty',
        },
        {
          itemId: 57,
          quantity: 1,
          unitPrice: 399.99,
          hasWarranty: true,
          warrantyDurationMonths: 18,
          warrantyDescription: '18 months fuel injector warranty',
        },
        {
          itemId: 58,
          quantity: 3,
          unitPrice: 19.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months fuel filter warranty',
        },
      ],
      paymentMethod: PaymentMethod.CASH,
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 11, // Performance Tuning Shop
      items: [
        {
          itemId: 14,
          quantity: 4,
          unitPrice: 129.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year valve spring warranty',
        },
        {
          itemId: 15,
          quantity: 1,
          unitPrice: 189.99,
          hasWarranty: true,
          warrantyDurationMonths: 18,
          warrantyDescription: '18 months oil pump warranty',
        },
        {
          itemId: 19,
          quantity: 2,
          unitPrice: 129.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year brake rotor warranty',
        },
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[1].id, // Backup Business Account
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 12, // Emergency Roadside Service
      items: [
        {
          itemId: 20,
          quantity: 5,
          unitPrice: 89.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year brake line warranty',
        },
        {
          itemId: 24,
          quantity: 3,
          unitPrice: 45.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months shift fork warranty',
        },
        {
          itemId: 25,
          quantity: 4,
          unitPrice: 29.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months transmission mount warranty',
        },
      ],
      paymentMethod: PaymentMethod.CASH,
      createDebt: true,
      debt: {
        amount: 150.0,
        dueDate: new Date('2025-06-01'),
        remarks: 'Emergency service payment plan',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.SELL,
      customerId: 1, // Mike's Auto Repair (reorder)
      items: [
        {
          itemId: 29,
          quantity: 2,
          unitPrice: 159.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year control arm warranty',
        },
        {
          itemId: 30,
          quantity: 6,
          unitPrice: 39.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months bushing warranty',
        },
        {
          itemId: 34,
          quantity: 1,
          unitPrice: 299.99,
          hasWarranty: true,
          warrantyDurationMonths: 24,
          warrantyDescription: '2 years alternator warranty',
        },
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[5].id, // KBZ Pay Digital Wallet
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 2, // Sarah's Car Care (reorder)
      items: [
        {
          itemId: 35,
          quantity: 1,
          unitPrice: 189.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year starter motor warranty',
        },
        {
          itemId: 39,
          quantity: 2,
          unitPrice: 189.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year fender warranty',
        },
        {
          itemId: 40,
          quantity: 2,
          unitPrice: 149.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year side mirror warranty',
        },
      ],
      paymentMethod: PaymentMethod.HYBRID,
      paymentAccountId: createdPaymentAccounts[6].id, // KBZ Mobile Banking
      cashAmount: 300.0,
      onlineAmount: 709.96,
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 3, // Quick Fix Garage (reorder)
      items: [
        {
          itemId: 44,
          quantity: 3,
          unitPrice: 89.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year floor mat warranty',
        },
        {
          itemId: 45,
          quantity: 2,
          unitPrice: 79.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year dashboard cover warranty',
        },
        {
          itemId: 49,
          quantity: 2,
          unitPrice: 89.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months exhaust tip warranty',
        },
      ],
      paymentMethod: PaymentMethod.CASH,
      createDebt: true,
      debt: {
        amount: 100.0,
        dueDate: new Date('2025-07-20'),
        remarks: 'Interior upgrade payment plan',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.SELL,
      customerId: 4, // Family Auto Service (reorder)
      items: [
        {
          itemId: 50,
          quantity: 4,
          unitPrice: 19.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months exhaust gasket warranty',
        },
        {
          itemId: 54,
          quantity: 1,
          unitPrice: 199.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year cooling fan warranty',
        },
        {
          itemId: 55,
          quantity: 3,
          unitPrice: 39.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months hose warranty',
        },
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[7].id, // Wave Pay Digital Wallet
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 5, // Professional Motors (reorder)
      items: [
        {
          itemId: 59,
          quantity: 2,
          unitPrice: 89.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year fuel pressure regulator warranty',
        },
        {
          itemId: 60,
          quantity: 3,
          unitPrice: 69.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year fuel line warranty',
        },
        {
          itemId: 11,
          quantity: 4,
          unitPrice: 45.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year piston ring warranty',
        },
      ],
      paymentMethod: PaymentMethod.HYBRID,
      paymentAccountId: createdPaymentAccounts[8].id, // AYA Pay Digital Wallet
      cashAmount: 200.0,
      onlineAmount: 509.94,
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 6, // Budget Auto Solutions (reorder)
      items: [
        {
          itemId: 16,
          quantity: 6,
          unitPrice: 79.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year brake pad warranty',
        },
        {
          itemId: 17,
          quantity: 4,
          unitPrice: 69.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year brake pad warranty',
        },
        {
          itemId: 18,
          quantity: 2,
          unitPrice: 149.99,
          hasWarranty: true,
          warrantyDurationMonths: 18,
          warrantyDescription: '18 months brake rotor warranty',
        },
      ],
      paymentMethod: PaymentMethod.CASH,
      createDebt: true,
      debt: {
        amount: 400.0,
        dueDate: new Date('2025-08-30'),
        remarks: 'Budget brake system upgrade',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.SELL,
      customerId: 7, // Classic Car Restoration (reorder)
      items: [
        {
          itemId: 21,
          quantity: 1,
          unitPrice: 399.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year clutch warranty',
        },
        {
          itemId: 22,
          quantity: 1,
          unitPrice: 299.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year flywheel warranty',
        },
        {
          itemId: 23,
          quantity: 1,
          unitPrice: 899.99,
          hasWarranty: true,
          warrantyDurationMonths: 24,
          warrantyDescription: '2 years gear set warranty',
        },
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[9].id, // KBZ Credit Card
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 8, // Truck & Fleet Service (reorder)
      items: [
        {
          itemId: 26,
          quantity: 3,
          unitPrice: 249.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year coil spring warranty',
        },
        {
          itemId: 27,
          quantity: 2,
          unitPrice: 399.99,
          hasWarranty: true,
          warrantyDurationMonths: 18,
          warrantyDescription: '18 months shock absorber warranty',
        },
        {
          itemId: 28,
          quantity: 2,
          unitPrice: 189.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year sway bar warranty',
        },
      ],
      paymentMethod: PaymentMethod.HYBRID,
      paymentAccountId: createdPaymentAccounts[0].id, // Main Business Bank Account
      cashAmount: 600.0,
      onlineAmount: 1689.95,
      createDebt: true,
      debt: {
        amount: 500.0,
        dueDate: new Date('2025-09-15'),
        remarks: 'Fleet service payment plan',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.SELL,
      customerId: 9, // Import Auto Specialists (reorder)
      items: [
        {
          itemId: 31,
          quantity: 15,
          unitPrice: 12.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months spark plug warranty',
        },
        {
          itemId: 32,
          quantity: 6,
          unitPrice: 89.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year ignition coil warranty',
        },
        {
          itemId: 33,
          quantity: 2,
          unitPrice: 199.99,
          hasWarranty: true,
          warrantyDurationMonths: 24,
          warrantyDescription: '2 years battery warranty',
        },
      ],
      paymentMethod: PaymentMethod.CASH,
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 10, // Mobile Auto Repair (reorder)
      items: [
        {
          itemId: 36,
          quantity: 1,
          unitPrice: 299.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year front bumper warranty',
        },
        {
          itemId: 37,
          quantity: 1,
          unitPrice: 279.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year rear bumper warranty',
        },
        {
          itemId: 38,
          quantity: 1,
          unitPrice: 899.99,
          hasWarranty: true,
          warrantyDurationMonths: 24,
          warrantyDescription: '2 years carbon fiber hood warranty',
        },
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[1].id, // Backup Business Account
      createDebt: true,
      debt: {
        amount: 800.0,
        dueDate: new Date('2025-10-20'),
        remarks: 'Mobile repair service payment plan',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.SELL,
      customerId: 11, // Performance Tuning Shop (reorder)
      items: [
        {
          itemId: 41,
          quantity: 3,
          unitPrice: 199.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year seat cover warranty',
        },
        {
          itemId: 42,
          quantity: 2,
          unitPrice: 299.99,
          hasWarranty: true,
          warrantyDurationMonths: 18,
          warrantyDescription: '18 months steering wheel warranty',
        },
        {
          itemId: 43,
          quantity: 5,
          unitPrice: 49.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months shift knob warranty',
        },
      ],
      paymentMethod: PaymentMethod.CASH,
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 12, // Emergency Roadside Service (reorder)
      items: [
        {
          itemId: 46,
          quantity: 2,
          unitPrice: 399.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year header warranty',
        },
        {
          itemId: 47,
          quantity: 1,
          unitPrice: 299.99,
          hasWarranty: true,
          warrantyDurationMonths: 18,
          warrantyDescription: '18 months catalytic converter warranty',
        },
        {
          itemId: 48,
          quantity: 3,
          unitPrice: 189.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year muffler warranty',
        },
      ],
      paymentMethod: PaymentMethod.HYBRID,
      paymentAccountId: createdPaymentAccounts[5].id, // KBZ Pay Digital Wallet
      cashAmount: 400.0,
      onlineAmount: 1289.96,
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 1, // Mike's Auto Repair (third order)
      items: [
        {
          itemId: 51,
          quantity: 1,
          unitPrice: 399.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year radiator warranty',
        },
        {
          itemId: 52,
          quantity: 1,
          unitPrice: 89.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year water pump warranty',
        },
        {
          itemId: 53,
          quantity: 3,
          unitPrice: 24.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months thermostat warranty',
        },
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[6].id, // KBZ Mobile Banking
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 2, // Sarah's Car Care (third order)
      items: [
        {
          itemId: 56,
          quantity: 1,
          unitPrice: 199.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year fuel pump warranty',
        },
        {
          itemId: 57,
          quantity: 1,
          unitPrice: 399.99,
          hasWarranty: true,
          warrantyDurationMonths: 18,
          warrantyDescription: '18 months fuel injector warranty',
        },
        {
          itemId: 58,
          quantity: 2,
          unitPrice: 19.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months fuel filter warranty',
        },
      ],
      paymentMethod: PaymentMethod.CASH,
      createDebt: true,
      debt: {
        amount: 300.0,
        dueDate: new Date('2025-11-15'),
        remarks: 'Fuel system upgrade payment plan',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.SELL,
      customerId: 3, // Quick Fix Garage (third order)
      items: [
        {
          itemId: 14,
          quantity: 3,
          unitPrice: 129.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year valve spring warranty',
        },
        {
          itemId: 15,
          quantity: 1,
          unitPrice: 189.99,
          hasWarranty: true,
          warrantyDurationMonths: 18,
          warrantyDescription: '18 months oil pump warranty',
        },
        {
          itemId: 19,
          quantity: 2,
          unitPrice: 129.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year brake rotor warranty',
        },
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[7].id, // Wave Pay Digital Wallet
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 4, // Family Auto Service (third order)
      items: [
        {
          itemId: 20,
          quantity: 4,
          unitPrice: 89.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year brake line warranty',
        },
        {
          itemId: 24,
          quantity: 2,
          unitPrice: 45.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months shift fork warranty',
        },
        {
          itemId: 25,
          quantity: 3,
          unitPrice: 29.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months transmission mount warranty',
        },
      ],
      paymentMethod: PaymentMethod.HYBRID,
      paymentAccountId: createdPaymentAccounts[8].id, // AYA Pay Digital Wallet
      cashAmount: 250.0,
      onlineAmount: 509.94,
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 5, // Professional Motors (third order)
      items: [
        {
          itemId: 29,
          quantity: 3,
          unitPrice: 159.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year control arm warranty',
        },
        {
          itemId: 30,
          quantity: 8,
          unitPrice: 39.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months bushing warranty',
        },
        {
          itemId: 34,
          quantity: 2,
          unitPrice: 299.99,
          hasWarranty: true,
          warrantyDurationMonths: 24,
          warrantyDescription: '2 years alternator warranty',
        },
      ],
      paymentMethod: PaymentMethod.CASH,
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 6, // Budget Auto Solutions (third order)
      items: [
        {
          itemId: 35,
          quantity: 2,
          unitPrice: 189.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year starter motor warranty',
        },
        {
          itemId: 39,
          quantity: 3,
          unitPrice: 189.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year fender warranty',
        },
        {
          itemId: 40,
          quantity: 3,
          unitPrice: 149.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year side mirror warranty',
        },
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[9].id, // KBZ Credit Card
      createDebt: true,
      debt: {
        amount: 600.0,
        dueDate: new Date('2025-12-20'),
        remarks: 'Budget body parts payment plan',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.SELL,
      customerId: 7, // Classic Car Restoration (third order)
      items: [
        {
          itemId: 44,
          quantity: 4,
          unitPrice: 89.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year floor mat warranty',
        },
        {
          itemId: 45,
          quantity: 3,
          unitPrice: 79.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year dashboard cover warranty',
        },
        {
          itemId: 49,
          quantity: 3,
          unitPrice: 89.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months exhaust tip warranty',
        },
      ],
      paymentMethod: PaymentMethod.CASH,
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 8, // Truck & Fleet Service (third order)
      items: [
        {
          itemId: 50,
          quantity: 6,
          unitPrice: 19.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months exhaust gasket warranty',
        },
        {
          itemId: 54,
          quantity: 2,
          unitPrice: 199.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year cooling fan warranty',
        },
        {
          itemId: 55,
          quantity: 5,
          unitPrice: 39.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months hose warranty',
        },
      ],
      paymentMethod: PaymentMethod.HYBRID,
      paymentAccountId: createdPaymentAccounts[0].id, // Main Business Bank Account
      cashAmount: 350.0,
      onlineAmount: 649.92,
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 9, // Import Auto Specialists (third order)
      items: [
        {
          itemId: 59,
          quantity: 3,
          unitPrice: 89.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year fuel pressure regulator warranty',
        },
        {
          itemId: 60,
          quantity: 4,
          unitPrice: 69.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year fuel line warranty',
        },
        {
          itemId: 11,
          quantity: 6,
          unitPrice: 45.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year piston ring warranty',
        },
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[1].id, // Backup Business Account
      createDebt: true,
      debt: {
        amount: 400.0,
        dueDate: new Date('2026-01-15'),
        remarks: 'Import specialist fuel system upgrade',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.SELL,
      customerId: 10, // Mobile Auto Repair (third order)
      items: [
        {
          itemId: 16,
          quantity: 5,
          unitPrice: 79.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year brake pad warranty',
        },
        {
          itemId: 17,
          quantity: 3,
          unitPrice: 69.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year brake pad warranty',
        },
        {
          itemId: 18,
          quantity: 2,
          unitPrice: 149.99,
          hasWarranty: true,
          warrantyDurationMonths: 18,
          warrantyDescription: '18 months brake rotor warranty',
        },
      ],
      paymentMethod: PaymentMethod.CASH,
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 11, // Performance Tuning Shop (third order)
      items: [
        {
          itemId: 21,
          quantity: 2,
          unitPrice: 399.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year clutch warranty',
        },
        {
          itemId: 22,
          quantity: 1,
          unitPrice: 299.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year flywheel warranty',
        },
        {
          itemId: 23,
          quantity: 1,
          unitPrice: 899.99,
          hasWarranty: true,
          warrantyDurationMonths: 24,
          warrantyDescription: '2 years gear set warranty',
        },
      ],
      paymentMethod: PaymentMethod.HYBRID,
      paymentAccountId: createdPaymentAccounts[5].id, // KBZ Pay Digital Wallet
      cashAmount: 800.0,
      onlineAmount: 1799.97,
      createDebt: false,
    },
    {
      type: TransactionType.SELL,
      customerId: 12, // Emergency Roadside Service (third order)
      items: [
        {
          itemId: 26,
          quantity: 2,
          unitPrice: 249.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year coil spring warranty',
        },
        {
          itemId: 27,
          quantity: 1,
          unitPrice: 399.99,
          hasWarranty: true,
          warrantyDurationMonths: 18,
          warrantyDescription: '18 months shock absorber warranty',
        },
        {
          itemId: 28,
          quantity: 1,
          unitPrice: 189.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year sway bar warranty',
        },
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[6].id, // KBZ Mobile Banking
      createDebt: true,
      debt: {
        amount: 250.0,
        dueDate: new Date('2026-02-15'),
        remarks: 'Emergency suspension repair payment plan',
        isSettled: false,
        alertSent: false,
      },
    },
  ];

  // Create sell transactions
  for (const transactionData of sellTransactions) {
    // Calculate total amount
    const totalAmount = transactionData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        type: transactionData.type,
        customerId: transactionData.customerId,
        totalAmount: totalAmount,
        paymentMethod: transactionData.paymentMethod,
        paymentAccountId: transactionData.paymentAccountId,
        cashAmount: transactionData.cashAmount,
        onlineAmount: transactionData.onlineAmount,
        date: new Date(),
      },
    });

    // Create transaction items with warranty information
    for (const itemData of transactionData.items) {
      const warrantyStartDate = new Date();
      const warrantyEndDate = new Date();
      warrantyEndDate.setMonth(
        warrantyEndDate.getMonth() + (itemData.warrantyDurationMonths || 0),
      );

      await prisma.transactionItem.create({
        data: {
          transactionId: transaction.id,
          itemId: itemData.itemId,
          quantity: itemData.quantity,
          unitPrice: itemData.unitPrice,
          totalAmount: itemData.quantity * itemData.unitPrice,
          hasWarranty: itemData.hasWarranty,
          warrantyDurationMonths: itemData.warrantyDurationMonths,
          warrantyStartDate: itemData.hasWarranty ? warrantyStartDate : null,
          warrantyEndDate: itemData.hasWarranty ? warrantyEndDate : null,
          warrantyDescription: itemData.warrantyDescription,
        },
      });
    }

    // Create customer debt if required
    if (transactionData.createDebt && transactionData.debt) {
      await prisma.debt.create({
        data: {
          customerId: transactionData.customerId,
          amount: transactionData.debt.amount,
          dueDate: transactionData.debt.dueDate,
          remarks: transactionData.debt.remarks,
          isSettled: transactionData.debt.isSettled,
          alertSent: transactionData.debt.alertSent,
          transactionId: transaction.id,
        },
      });
    }

    // Update stock quantities (decrease for SELL transactions)
    for (const itemData of transactionData.items) {
      await prisma.stock.updateMany({
        where: { itemId: itemData.itemId },
        data: {
          quantity: {
            decrement: itemData.quantity,
          },
        },
      });
    }

    console.log(
      `✅ Sell transaction created: ${transaction.id} - Total: $${totalAmount.toFixed(2)}`,
    );
  }

  // Create additional transactions with approaching and due debts for testing
  console.log(
    '🚨 Creating test transactions with approaching and due debts...',
  );

  const now = new Date();

  // Create approaching debts (due in 2-3 days)
  const approachingDebtTransactions = [
    {
      type: TransactionType.SELL,
      customerId: 1, // Mike's Auto Repair
      items: [
        {
          itemId: 11,
          quantity: 3,
          unitPrice: 45.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year manufacturer warranty',
        },
        {
          itemId: 12,
          quantity: 2,
          unitPrice: 89.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months engine parts warranty',
        },
      ],
      paymentMethod: PaymentMethod.CASH,
      createDebt: true,
      debt: {
        amount: 300.0,
        dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        remarks: 'Approaching debt test - due in 2 days',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.SELL,
      customerId: 2, // Sarah's Car Care
      items: [
        {
          itemId: 16,
          quantity: 4,
          unitPrice: 79.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year brake system warranty',
        },
        {
          itemId: 17,
          quantity: 3,
          unitPrice: 69.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year brake system warranty',
        },
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[5].id, // KBZ Pay Digital Wallet
      createDebt: true,
      debt: {
        amount: 450.0,
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        remarks: 'Approaching debt test - due in 3 days',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.SELL,
      customerId: 3, // Quick Fix Garage
      items: [
        {
          itemId: 21,
          quantity: 1,
          unitPrice: 399.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year clutch warranty',
        },
        {
          itemId: 22,
          quantity: 1,
          unitPrice: 299.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year flywheel warranty',
        },
      ],
      paymentMethod: PaymentMethod.HYBRID,
      paymentAccountId: createdPaymentAccounts[6].id, // KBZ Mobile Banking
      cashAmount: 500.0,
      onlineAmount: 199.98,
      createDebt: true,
      debt: {
        amount: 600.0,
        dueDate: new Date(now.getTime() + 2.5 * 24 * 60 * 60 * 1000), // 2.5 days from now
        remarks: 'Approaching debt test - due in 2.5 days',
        isSettled: false,
        alertSent: false,
      },
    },
  ];

  // Create due debts (due within 24 hours)
  const dueDebtTransactions = [
    {
      type: TransactionType.SELL,
      customerId: 4, // Family Auto Service
      items: [
        {
          itemId: 26,
          quantity: 2,
          unitPrice: 249.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year suspension warranty',
        },
        {
          itemId: 27,
          quantity: 1,
          unitPrice: 399.99,
          hasWarranty: true,
          warrantyDurationMonths: 18,
          warrantyDescription: '18 months shock absorber warranty',
        },
      ],
      paymentMethod: PaymentMethod.CASH,
      createDebt: true,
      debt: {
        amount: 900.0,
        dueDate: new Date(now.getTime() + 12 * 60 * 60 * 1000), // 12 hours from now
        remarks: 'Due debt test - due in 12 hours',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.SELL,
      customerId: 5, // Professional Motors
      items: [
        {
          itemId: 31,
          quantity: 10,
          unitPrice: 12.99,
          hasWarranty: true,
          warrantyDurationMonths: 6,
          warrantyDescription: '6 months spark plug warranty',
        },
        {
          itemId: 32,
          quantity: 4,
          unitPrice: 89.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year ignition coil warranty',
        },
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[7].id, // Wave Pay Digital Wallet
      createDebt: true,
      debt: {
        amount: 750.0,
        dueDate: new Date(now.getTime() + 6 * 60 * 60 * 1000), // 6 hours from now
        remarks: 'Due debt test - due in 6 hours',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.SELL,
      customerId: 6, // Budget Auto Solutions
      items: [
        {
          itemId: 36,
          quantity: 1,
          unitPrice: 299.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year bumper warranty',
        },
        {
          itemId: 37,
          quantity: 1,
          unitPrice: 279.99,
          hasWarranty: true,
          warrantyDurationMonths: 12,
          warrantyDescription: '1 year bumper warranty',
        },
      ],
      paymentMethod: PaymentMethod.HYBRID,
      paymentAccountId: createdPaymentAccounts[8].id, // AYA Pay Digital Wallet
      cashAmount: 300.0,
      onlineAmount: 279.98,
      createDebt: true,
      debt: {
        amount: 800.0,
        dueDate: new Date(now.getTime() + 18 * 60 * 60 * 1000), // 18 hours from now
        remarks: 'Due debt test - due in 18 hours',
        isSettled: false,
        alertSent: false,
      },
    },
  ];

  // Create supplier debts with approaching and due dates
  const supplierApproachingDebtTransactions = [
    {
      type: TransactionType.BUY,
      supplierId: 1, // AutoZone Parts Co.
      items: [
        { itemId: 11, quantity: 20, unitPrice: 35.0 },
        { itemId: 12, quantity: 15, unitPrice: 65.0 },
      ],
      paymentMethod: PaymentMethod.HYBRID,
      paymentAccountId: createdPaymentAccounts[0].id, // Main Business Bank Account
      cashAmount: 1000.0,
      onlineAmount: 1000.0,
      createSupplierDebt: true,
      supplierDebt: {
        amount: 1200.0,
        dueDate: new Date(now.getTime() + 2.5 * 24 * 60 * 60 * 1000), // 2.5 days from now
        remarks: 'Supplier approaching debt test - due in 2.5 days',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.BUY,
      supplierId: 2, // Motor Masters Supply
      items: [
        { itemId: 21, quantity: 5, unitPrice: 350.0 },
        { itemId: 22, quantity: 3, unitPrice: 250.0 },
      ],
      paymentMethod: PaymentMethod.ONLINE,
      paymentAccountId: createdPaymentAccounts[1].id, // Backup Business Account
      createSupplierDebt: true,
      supplierDebt: {
        amount: 2500.0,
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        remarks: 'Supplier approaching debt test - due in 3 days',
        isSettled: false,
        alertSent: false,
      },
    },
  ];

  const supplierDueDebtTransactions = [
    {
      type: TransactionType.BUY,
      supplierId: 3, // Premium Auto Components
      items: [
        { itemId: 31, quantity: 50, unitPrice: 8.0 },
        { itemId: 32, quantity: 20, unitPrice: 70.0 },
      ],
      paymentMethod: PaymentMethod.CASH,
      createSupplierDebt: true,
      supplierDebt: {
        amount: 1800.0,
        dueDate: new Date(now.getTime() + 8 * 60 * 60 * 1000), // 8 hours from now
        remarks: 'Supplier due debt test - due in 8 hours',
        isSettled: false,
        alertSent: false,
      },
    },
    {
      type: TransactionType.BUY,
      supplierId: 4, // dfgdgdfg
      items: [
        { itemId: 41, quantity: 8, unitPrice: 180.0 },
        { itemId: 42, quantity: 6, unitPrice: 250.0 },
      ],
      paymentMethod: PaymentMethod.HYBRID,
      paymentAccountId: createdPaymentAccounts[2].id, // Digital Wallet - PayPal
      cashAmount: 1500.0,
      onlineAmount: 1500.0,
      createSupplierDebt: true,
      supplierDebt: {
        amount: 3000.0,
        dueDate: new Date(now.getTime() + 15 * 60 * 60 * 1000), // 15 hours from now
        remarks: 'Supplier due debt test - due in 15 hours',
        isSettled: false,
        alertSent: false,
      },
    },
  ];

  // Process approaching debt transactions
  for (const transactionData of approachingDebtTransactions) {
    const totalAmount = transactionData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    const transaction = await prisma.transaction.create({
      data: {
        type: transactionData.type,
        customerId: transactionData.customerId,
        totalAmount: totalAmount,
        paymentMethod: transactionData.paymentMethod,
        paymentAccountId: transactionData.paymentAccountId,
        cashAmount: transactionData.cashAmount,
        onlineAmount: transactionData.onlineAmount,
        date: new Date(),
      },
    });

    // Create transaction items
    for (const itemData of transactionData.items) {
      await prisma.transactionItem.create({
        data: {
          transactionId: transaction.id,
          itemId: itemData.itemId,
          quantity: itemData.quantity,
          unitPrice: itemData.unitPrice,
          totalAmount: itemData.quantity * itemData.unitPrice,
          hasWarranty: itemData.hasWarranty,
          warrantyDurationMonths: itemData.warrantyDurationMonths,
          warrantyStartDate: itemData.hasWarranty ? new Date() : null,
          warrantyEndDate: itemData.hasWarranty
            ? new Date(
                Date.now() +
                  (itemData.warrantyDurationMonths || 0) *
                    30 *
                    24 *
                    60 *
                    60 *
                    1000,
              )
            : null,
          warrantyDescription: itemData.warrantyDescription,
        },
      });
    }

    // Create customer debt
    if (transactionData.createDebt && transactionData.debt) {
      await prisma.debt.create({
        data: {
          customerId: transactionData.customerId,
          amount: transactionData.debt.amount,
          dueDate: transactionData.debt.dueDate,
          remarks: transactionData.debt.remarks,
          isSettled: transactionData.debt.isSettled,
          alertSent: transactionData.debt.alertSent,
          transactionId: transaction.id,
        },
      });
    }

    // Update stock quantities
    for (const itemData of transactionData.items) {
      await prisma.stock.updateMany({
        where: { itemId: itemData.itemId },
        data: {
          quantity: {
            decrement: itemData.quantity,
          },
        },
      });
    }

    console.log(
      `✅ Approaching debt transaction created: ${transaction.id} - Total: $${totalAmount.toFixed(2)}`,
    );
  }

  // Process due debt transactions
  for (const transactionData of dueDebtTransactions) {
    const totalAmount = transactionData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    const transaction = await prisma.transaction.create({
      data: {
        type: transactionData.type,
        customerId: transactionData.customerId,
        totalAmount: totalAmount,
        paymentMethod: transactionData.paymentMethod,
        paymentAccountId: transactionData.paymentAccountId,
        cashAmount: transactionData.cashAmount,
        onlineAmount: transactionData.onlineAmount,
        date: new Date(),
      },
    });

    // Create transaction items
    for (const itemData of transactionData.items) {
      await prisma.transactionItem.create({
        data: {
          transactionId: transaction.id,
          itemId: itemData.itemId,
          quantity: itemData.quantity,
          unitPrice: itemData.unitPrice,
          totalAmount: itemData.quantity * itemData.unitPrice,
          hasWarranty: itemData.hasWarranty,
          warrantyDurationMonths: itemData.warrantyDurationMonths,
          warrantyStartDate: itemData.hasWarranty ? new Date() : null,
          warrantyEndDate: itemData.hasWarranty
            ? new Date(
                Date.now() +
                  (itemData.warrantyDurationMonths || 0) *
                    30 *
                    24 *
                    60 *
                    60 *
                    1000,
              )
            : null,
          warrantyDescription: itemData.warrantyDescription,
        },
      });
    }

    // Create customer debt
    if (transactionData.createDebt && transactionData.debt) {
      await prisma.debt.create({
        data: {
          customerId: transactionData.customerId,
          amount: transactionData.debt.amount,
          dueDate: transactionData.debt.dueDate,
          remarks: transactionData.debt.remarks,
          isSettled: transactionData.debt.isSettled,
          alertSent: transactionData.debt.alertSent,
          transactionId: transaction.id,
        },
      });
    }

    // Update stock quantities
    for (const itemData of transactionData.items) {
      await prisma.stock.updateMany({
        where: { itemId: itemData.itemId },
        data: {
          quantity: {
            decrement: itemData.quantity,
          },
        },
      });
    }

    console.log(
      `✅ Due debt transaction created: ${transaction.id} - Total: $${totalAmount.toFixed(2)}`,
    );
  }

  // Process supplier approaching debt transactions
  for (const transactionData of supplierApproachingDebtTransactions) {
    const totalAmount = transactionData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    const transaction = await prisma.transaction.create({
      data: {
        type: transactionData.type,
        supplierId: transactionData.supplierId,
        totalAmount: totalAmount,
        paymentMethod: transactionData.paymentMethod,
        paymentAccountId: transactionData.paymentAccountId,
        cashAmount: transactionData.cashAmount,
        onlineAmount: transactionData.onlineAmount,
        date: new Date(),
      },
    });

    // Create transaction items
    for (const itemData of transactionData.items) {
      await prisma.transactionItem.create({
        data: {
          transactionId: transaction.id,
          itemId: itemData.itemId,
          quantity: itemData.quantity,
          unitPrice: itemData.unitPrice,
          totalAmount: itemData.quantity * itemData.unitPrice,
        },
      });
    }

    // Create supplier debt
    if (transactionData.createSupplierDebt && transactionData.supplierDebt) {
      await prisma.supplierDebt.create({
        data: {
          supplierId: transactionData.supplierId,
          amount: transactionData.supplierDebt.amount,
          dueDate: transactionData.supplierDebt.dueDate,
          remarks: transactionData.supplierDebt.remarks,
          isSettled: transactionData.supplierDebt.isSettled,
          alertSent: transactionData.supplierDebt.alertSent,
          transactionId: transaction.id,
        },
      });
    }

    // Update stock quantities
    for (const itemData of transactionData.items) {
      await prisma.stock.updateMany({
        where: { itemId: itemData.itemId },
        data: {
          quantity: {
            increment: itemData.quantity,
          },
        },
      });
    }

    console.log(
      `✅ Supplier approaching debt transaction created: ${transaction.id} - Total: $${totalAmount.toFixed(2)}`,
    );
  }

  // Process supplier due debt transactions
  for (const transactionData of supplierDueDebtTransactions) {
    const totalAmount = transactionData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    const transaction = await prisma.transaction.create({
      data: {
        type: transactionData.type,
        supplierId: transactionData.supplierId,
        totalAmount: totalAmount,
        paymentMethod: transactionData.paymentMethod,
        paymentAccountId: transactionData.paymentAccountId,
        cashAmount: transactionData.cashAmount,
        onlineAmount: transactionData.onlineAmount,
        date: new Date(),
      },
    });

    // Create transaction items
    for (const itemData of transactionData.items) {
      await prisma.transactionItem.create({
        data: {
          transactionId: transaction.id,
          itemId: itemData.itemId,
          quantity: itemData.quantity,
          unitPrice: itemData.unitPrice,
          totalAmount: itemData.quantity * itemData.unitPrice,
        },
      });
    }

    // Create supplier debt
    if (transactionData.createSupplierDebt && transactionData.supplierDebt) {
      await prisma.supplierDebt.create({
        data: {
          supplierId: transactionData.supplierId,
          amount: transactionData.supplierDebt.amount,
          dueDate: transactionData.supplierDebt.dueDate,
          remarks: transactionData.supplierDebt.remarks,
          isSettled: transactionData.supplierDebt.isSettled,
          alertSent: transactionData.supplierDebt.alertSent,
          transactionId: transaction.id,
        },
      });
    }

    // Update stock quantities
    for (const itemData of transactionData.items) {
      await prisma.stock.updateMany({
        where: { itemId: itemData.itemId },
        data: {
          quantity: {
            increment: itemData.quantity,
          },
        },
      });
    }

    console.log(
      `✅ Supplier due debt transaction created: ${transaction.id} - Total: $${totalAmount.toFixed(2)}`,
    );
  }

  // Create refund transactions for various scenarios
  console.log('🔄 Creating refund transaction seed data...');

  // First, get all SELL transaction items to use for refunds
  const sellTransactionItems = await prisma.transactionItem.findMany({
    where: {
      transaction: {
        type: TransactionType.SELL,
      },
    },
    include: {
      transaction: {
        include: {
          customer: true,
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  });

  console.log(
    `📊 Found ${sellTransactionItems.length} SELL transaction items for refunds`,
  );

  // Create refund data using actual transaction item IDs
  const refundTransactions = [
    // Money refunds for defective products
    {
      refundType: RefundType.MONEY_REFUND,
      reason: 'Defective brake pads - customer safety concern',
      totalRefundAmount: 319.96,
      refundItems: [
        {
          originalTransactionItemId: sellTransactionItems[0]?.id,
          quantityToRefund: 4,
          refundAmount: 319.96,
        },
      ],
    },
    {
      refundType: RefundType.MONEY_REFUND,
      reason: 'Wrong part ordered - incompatible with vehicle model',
      totalRefundAmount: 269.97,
      refundItems: [
        {
          originalTransactionItemId: sellTransactionItems[1]?.id,
          quantityToRefund: 3,
          refundAmount: 269.97,
        },
      ],
    },
    {
      refundType: RefundType.MONEY_REFUND,
      reason: 'Quality issues - premature wear detected',
      totalRefundAmount: 299.99,
      refundItems: [
        {
          originalTransactionItemId: sellTransactionItems[2]?.id,
          quantityToRefund: 1,
          refundAmount: 299.99,
        },
      ],
    },
    {
      refundType: RefundType.MONEY_REFUND,
      reason: 'Customer dissatisfaction - performance below expectations',
      totalRefundAmount: 1279.84,
      refundItems: [
        {
          originalTransactionItemId: sellTransactionItems[3]?.id,
          quantityToRefund: 4,
          refundAmount: 639.92,
        },
        {
          originalTransactionItemId: sellTransactionItems[4]?.id,
          quantityToRefund: 3,
          refundAmount: 419.94,
        },
        {
          originalTransactionItemId: sellTransactionItems[5]?.id,
          quantityToRefund: 1,
          refundAmount: 219.98,
        },
      ],
    },
    {
      refundType: RefundType.MONEY_REFUND,
      reason: 'Damaged during shipping - packaging insufficient',
      totalRefundAmount: 259.9,
      refundItems: [
        {
          originalTransactionItemId: sellTransactionItems[9]?.id, // From third sell transaction
          quantityToRefund: 10,
          refundAmount: 259.9,
        },
      ],
    },
    // Store credit refunds
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Customer changed mind - within return policy',
      totalRefundAmount: 1799.96,
      refundItems: [
        {
          originalTransactionItemId: sellTransactionItems[6]?.id, // From third sell transaction
          quantityToRefund: 2,
          refundAmount: 799.98,
        },
        {
          originalTransactionItemId: sellTransactionItems[7]?.id, // From third sell transaction
          quantityToRefund: 1,
          refundAmount: 299.99,
        },
        {
          originalTransactionItemId: sellTransactionItems[8]?.id, // From third sell transaction
          quantityToRefund: 1,
          refundAmount: 899.99,
        },
      ],
    },
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Duplicate order - customer error',
      totalRefundAmount: 1379.94,
      refundItems: [
        {
          originalTransactionItemId: sellTransactionItems[10]?.id, // From fourth sell transaction
          quantityToRefund: 2,
          refundAmount: 999.96,
        },
        {
          originalTransactionItemId: sellTransactionItems[11]?.id, // From fourth sell transaction
          quantityToRefund: 1,
          refundAmount: 379.98,
        },
      ],
    },
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Overstock return - bulk purchase adjustment',
      totalRefundAmount: 1559.85,
      refundItems: [
        {
          originalTransactionItemId: sellTransactionItems[12]?.id, // From fifth sell transaction
          quantityToRefund: 10,
          refundAmount: 259.8,
        },
        {
          originalTransactionItemId: sellTransactionItems[13]?.id, // From fifth sell transaction
          quantityToRefund: 4,
          refundAmount: 719.92,
        },
        {
          originalTransactionItemId: sellTransactionItems[14]?.id, // From fifth sell transaction
          quantityToRefund: 2,
          refundAmount: 599.98,
        },
      ],
    },
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Color mismatch - not as described online',
      totalRefundAmount: 1759.96,
      refundItems: [
        {
          originalTransactionItemId: sellTransactionItems[15]?.id, // From sixth sell transaction
          quantityToRefund: 2,
          refundAmount: 599.98,
        },
        {
          originalTransactionItemId: sellTransactionItems[16]?.id, // From sixth sell transaction
          quantityToRefund: 2,
          refundAmount: 559.98,
        },
        {
          originalTransactionItemId: sellTransactionItems[17]?.id, // From sixth sell transaction
          quantityToRefund: 1,
          refundAmount: 899.99,
        },
      ],
    },
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Size incorrect - measurement error',
      totalRefundAmount: 749.95,
      refundItems: [
        {
          originalTransactionItemId: sellTransactionItems[18]?.id, // From seventh sell transaction
          quantityToRefund: 2,
          refundAmount: 399.98,
        },
        {
          originalTransactionItemId: sellTransactionItems[19]?.id, // From seventh sell transaction
          quantityToRefund: 1,
          refundAmount: 299.99,
        },
        {
          originalTransactionItemId: sellTransactionItems[20]?.id, // From seventh sell transaction
          quantityToRefund: 1,
          refundAmount: 49.99,
        },
      ],
    },
    // Exchange refunds
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Warranty claim - defective within warranty period',
      totalRefundAmount: 2159.94,
      refundItems: [
        {
          originalTransactionItemId: sellTransactionItems[21]?.id, // From eighth sell transaction
          quantityToRefund: 2,
          refundAmount: 1199.97,
        },
        {
          originalTransactionItemId: sellTransactionItems[22]?.id, // From eighth sell transaction
          quantityToRefund: 1,
          refundAmount: 599.98,
        },
        {
          originalTransactionItemId: sellTransactionItems[23]?.id, // From eighth sell transaction
          quantityToRefund: 2,
          refundAmount: 759.96,
        },
      ],
    },
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Upgrade request - customer wants better model',
      totalRefundAmount: 1024.94,
      refundItems: [
        {
          originalTransactionItemId: sellTransactionItems[24]?.id, // From ninth sell transaction
          quantityToRefund: 1,
          refundAmount: 799.98,
        },
        {
          originalTransactionItemId: sellTransactionItems[25]?.id, // From ninth sell transaction
          quantityToRefund: 1,
          refundAmount: 89.99,
        },
        {
          originalTransactionItemId: sellTransactionItems[26]?.id, // From ninth sell transaction
          quantityToRefund: 3,
          refundAmount: 124.95,
        },
      ],
    },
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Compatibility issue - not suitable for vehicle type',
      totalRefundAmount: 659.95,
      refundItems: [
        {
          originalTransactionItemId: sellTransactionItems[27]?.id, // From tenth sell transaction
          quantityToRefund: 1,
          refundAmount: 199.99,
        },
        {
          originalTransactionItemId: sellTransactionItems[28]?.id, // From tenth sell transaction
          quantityToRefund: 1,
          refundAmount: 399.99,
        },
        {
          originalTransactionItemId: sellTransactionItems[29]?.id, // From tenth sell transaction
          quantityToRefund: 2,
          refundAmount: 59.97,
        },
      ],
    },
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Installation problem - mechanic recommendation',
      totalRefundAmount: 1009.94,
      refundItems: [
        {
          originalTransactionItemId: sellTransactionItems[30]?.id, // From eleventh sell transaction
          quantityToRefund: 2,
          refundAmount: 519.96,
        },
        {
          originalTransactionItemId: sellTransactionItems[31]?.id, // From eleventh sell transaction
          quantityToRefund: 1,
          refundAmount: 189.99,
        },
        {
          originalTransactionItemId: sellTransactionItems[32]?.id, // From eleventh sell transaction
          quantityToRefund: 1,
          refundAmount: 299.99,
        },
      ],
    },
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Performance upgrade - racing requirements',
      totalRefundAmount: 687.93,
      refundItems: [
        {
          originalTransactionItemId: sellTransactionItems[33]?.id, // From twelfth sell transaction
          quantityToRefund: 3,
          refundAmount: 449.95,
        },
        {
          originalTransactionItemId: sellTransactionItems[34]?.id, // From twelfth sell transaction
          quantityToRefund: 2,
          refundAmount: 137.98,
        },
        {
          originalTransactionItemId: sellTransactionItems[35]?.id, // From twelfth sell transaction
          quantityToRefund: 1,
          refundAmount: 99.99,
        },
      ],
    },
    // Mixed scenario refunds with multiple items from reorders
    {
      refundType: RefundType.MONEY_REFUND,
      reason: 'Bulk return - fleet policy change',
      totalRefundAmount: 959.91,
      refundItems: [
        {
          originalTransactionItemId: sellTransactionItems[36]?.id, // From Mike's Auto Repair reorder
          quantityToRefund: 2,
          refundAmount: 319.98,
        },
        {
          originalTransactionItemId: sellTransactionItems[37]?.id, // From Mike's Auto Repair reorder
          quantityToRefund: 4,
          refundAmount: 239.96,
        },
        {
          originalTransactionItemId: sellTransactionItems[38]?.id, // From Mike's Auto Repair reorder
          quantityToRefund: 1,
          refundAmount: 299.99,
        },
      ],
    },
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Seasonal return - winter to summer parts',
      totalRefundAmount: 1009.95,
      refundItems: [
        {
          originalTransactionItemId: sellTransactionItems[39]?.id, // From Sarah's Car Care reorder
          quantityToRefund: 1,
          refundAmount: 189.99,
        },
        {
          originalTransactionItemId: 41, // From Sarah's Car Care reorder
          quantityToRefund: 2,
          refundAmount: 379.98,
        },
        {
          originalTransactionItemId: 42, // From Sarah's Car Care reorder
          quantityToRefund: 2,
          refundAmount: 299.98,
        },
      ],
    },
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Technology upgrade - newer model available',
      totalRefundAmount: 629.95,
      refundItems: [
        {
          originalTransactionItemId: 43, // From Quick Fix Garage reorder
          quantityToRefund: 2,
          refundAmount: 269.97,
        },
        {
          originalTransactionItemId: 44, // From Quick Fix Garage reorder
          quantityToRefund: 1,
          refundAmount: 159.98,
        },
        {
          originalTransactionItemId: 45, // From Quick Fix Garage reorder
          quantityToRefund: 1,
          refundAmount: 179.98,
        },
      ],
    },
    // Warranty and recall scenarios
    {
      refundType: RefundType.MONEY_REFUND,
      reason: 'Manufacturer recall - safety issue identified',
      totalRefundAmount: 439.93,
      refundItems: [
        {
          originalTransactionItemId: 46, // From Family Auto Service reorder
          quantityToRefund: 2,
          refundAmount: 79.96,
        },
        {
          originalTransactionItemId: 47, // From Family Auto Service reorder
          quantityToRefund: 1,
          refundAmount: 199.99,
        },
        {
          originalTransactionItemId: 48, // From Family Auto Service reorder
          quantityToRefund: 2,
          refundAmount: 119.97,
        },
      ],
    },
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Extended warranty claim - premature failure',
      totalRefundAmount: 669.94,
      refundItems: [
        {
          originalTransactionItemId: 49, // From Professional Motors reorder
          quantityToRefund: 1,
          refundAmount: 179.98,
        },
        {
          originalTransactionItemId: 50, // From Professional Motors reorder
          quantityToRefund: 2,
          refundAmount: 209.97,
        },
        {
          originalTransactionItemId: 51, // From Professional Motors reorder
          quantityToRefund: 2,
          refundAmount: 183.96,
        },
      ],
    },
    // Customer service scenarios
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Goodwill gesture - customer loyalty program',
      totalRefundAmount: 1179.92,
      refundItems: [
        {
          originalTransactionItemId: 52, // From Budget Auto Solutions reorder
          quantityToRefund: 3,
          refundAmount: 479.94,
        },
        {
          originalTransactionItemId: 53, // From Budget Auto Solutions reorder
          quantityToRefund: 2,
          refundAmount: 279.96,
        },
        {
          originalTransactionItemId: 54, // From Budget Auto Solutions reorder
          quantityToRefund: 1,
          refundAmount: 299.98,
        },
      ],
    },
    {
      refundType: RefundType.MONEY_REFUND,
      reason: 'Service error - incorrect part installed by our technician',
      totalRefundAmount: 1599.97,
      refundItems: [
        {
          originalTransactionItemId: 55, // From Classic Car Restoration reorder
          quantityToRefund: 1,
          refundAmount: 399.99,
        },
        {
          originalTransactionItemId: 56, // From Classic Car Restoration reorder
          quantityToRefund: 1,
          refundAmount: 299.99,
        },
        {
          originalTransactionItemId: 57, // From Classic Car Restoration reorder
          quantityToRefund: 1,
          refundAmount: 899.99,
        },
      ],
    },
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Professional recommendation - mechanic suggested alternative',
      totalRefundAmount: 2289.95,
      refundItems: [
        {
          originalTransactionItemId: 58, // From Truck & Fleet Service reorder
          quantityToRefund: 2,
          refundAmount: 749.97,
        },
        {
          originalTransactionItemId: 59, // From Truck & Fleet Service reorder
          quantityToRefund: 1,
          refundAmount: 799.98,
        },
        {
          originalTransactionItemId: 60, // From Truck & Fleet Service reorder
          quantityToRefund: 1,
          refundAmount: 379.98,
        },
      ],
    },
    // Special cases with approaching debt transactions
    {
      refundType: RefundType.MONEY_REFUND,
      reason: 'Import restriction - customs regulation change',
      totalRefundAmount: 417.95,
      refundItems: [
        {
          originalTransactionItemId: 81, // From approaching debt transaction 1
          quantityToRefund: 2,
          refundAmount: 137.97,
        },
        {
          originalTransactionItemId: 82, // From approaching debt transaction 1
          quantityToRefund: 1,
          refundAmount: 179.98,
        },
      ],
    },
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Business closure - customer relocating',
      totalRefundAmount: 529.93,
      refundItems: [
        {
          originalTransactionItemId: 83, // From approaching debt transaction 2
          quantityToRefund: 2,
          refundAmount: 319.96,
        },
        {
          originalTransactionItemId: 84, // From approaching debt transaction 2
          quantityToRefund: 1,
          refundAmount: 209.97,
        },
      ],
    },
    // Emergency and fleet scenarios with due debt transactions
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Emergency service change - different vehicle requirements',
      totalRefundAmount: 1099.97,
      refundItems: [
        {
          originalTransactionItemId: 85, // From approaching debt transaction 3
          quantityToRefund: 1,
          refundAmount: 399.99,
        },
        {
          originalTransactionItemId: 86, // From approaching debt transaction 3
          quantityToRefund: 1,
          refundAmount: 299.99,
        },
      ],
    },
    {
      refundType: RefundType.MONEY_REFUND,
      reason: 'Fleet maintenance policy update - standardization required',
      totalRefundAmount: 1299.96,
      refundItems: [
        {
          originalTransactionItemId: 87, // From due debt transaction 1
          quantityToRefund: 2,
          refundAmount: 499.98,
        },
        {
          originalTransactionItemId: 88, // From due debt transaction 1
          quantityToRefund: 1,
          refundAmount: 399.99,
        },
      ],
    },
    // Performance and racing scenarios with due debt transactions
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Racing regulation change - parts no longer allowed',
      totalRefundAmount: 489.86,
      refundItems: [
        {
          originalTransactionItemId: 89, // From due debt transaction 2
          quantityToRefund: 5,
          refundAmount: 129.9,
        },
        {
          originalTransactionItemId: 90, // From due debt transaction 2
          quantityToRefund: 2,
          refundAmount: 359.96,
        },
      ],
    },
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Performance downgrade - customer preference change',
      totalRefundAmount: 579.98,
      refundItems: [
        {
          originalTransactionItemId: 91, // From due debt transaction 3
          quantityToRefund: 1,
          refundAmount: 299.99,
        },
        {
          originalTransactionItemId: 92, // From due debt transaction 3
          quantityToRefund: 1,
          refundAmount: 279.99,
        },
      ],
    },
    // Additional comprehensive scenarios
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Vehicle modification requirements changed',
      totalRefundAmount: 1949.85,
      refundItems: [
        {
          originalTransactionItemId: 61, // From Import Auto Specialists reorder
          quantityToRefund: 8,
          refundAmount: 194.85,
        },
        {
          originalTransactionItemId: 62, // From Import Auto Specialists reorder
          quantityToRefund: 3,
          refundAmount: 539.94,
        },
        {
          originalTransactionItemId: 63, // From Import Auto Specialists reorder
          quantityToRefund: 1,
          refundAmount: 399.98,
        },
      ],
    },
    {
      refundType: RefundType.MONEY_REFUND,
      reason: 'Installation compatibility issue discovered',
      totalRefundAmount: 2279.96,
      refundItems: [
        {
          originalTransactionItemId: 64, // From Mobile Auto Repair reorder
          quantityToRefund: 1,
          refundAmount: 299.99,
        },
        {
          originalTransactionItemId: 65, // From Mobile Auto Repair reorder
          quantityToRefund: 1,
          refundAmount: 279.99,
        },
        {
          originalTransactionItemId: 66, // From Mobile Auto Repair reorder
          quantityToRefund: 1,
          refundAmount: 899.99,
        },
      ],
    },
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Customer preference change - different brand requested',
      totalRefundAmount: 1549.95,
      refundItems: [
        {
          originalTransactionItemId: 67, // From Performance Tuning Shop reorder
          quantityToRefund: 2,
          refundAmount: 599.98,
        },
        {
          originalTransactionItemId: 68, // From Performance Tuning Shop reorder
          quantityToRefund: 1,
          refundAmount: 599.98,
        },
        {
          originalTransactionItemId: 69, // From Performance Tuning Shop reorder
          quantityToRefund: 3,
          refundAmount: 249.95,
        },
      ],
    },
    // Final comprehensive scenarios covering all transaction types
    {
      refundType: RefundType.MONEY_REFUND,
      reason: 'End of season clearance - customer return policy',
      totalRefundAmount: 1799.94,
      refundItems: [
        {
          originalTransactionItemId: 70, // From Emergency Roadside Service reorder
          quantityToRefund: 2,
          refundAmount: 799.98,
        },
        {
          originalTransactionItemId: 71, // From Emergency Roadside Service reorder
          quantityToRefund: 1,
          refundAmount: 299.99,
        },
        {
          originalTransactionItemId: 72, // From Emergency Roadside Service reorder
          quantityToRefund: 2,
          refundAmount: 569.97,
        },
      ],
    },
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Warranty extension expired - customer goodwill',
      totalRefundAmount: 1689.96,
      refundItems: [
        {
          originalTransactionItemId: 73, // From third order transactions
          quantityToRefund: 1,
          refundAmount: 399.99,
        },
        {
          originalTransactionItemId: 74, // From third order transactions
          quantityToRefund: 1,
          refundAmount: 89.99,
        },
        {
          originalTransactionItemId: 75, // From third order transactions
          quantityToRefund: 2,
          refundAmount: 149.98,
        },
      ],
    },
    {
      refundType: RefundType.ITEM_EXCHANGE,
      reason: 'Loyalty program reward - customer appreciation',
      totalRefundAmount: 2399.92,
      refundItems: [
        {
          originalTransactionItemId: 76, // From third order transactions
          quantityToRefund: 1,
          refundAmount: 199.99,
        },
        {
          originalTransactionItemId: 77, // From third order transactions
          quantityToRefund: 1,
          refundAmount: 399.99,
        },
        {
          originalTransactionItemId: 78, // From third order transactions
          quantityToRefund: 1,
          refundAmount: 39.98,
        },
      ],
    },
  ];

  // Process refund transactions
  for (const refundData of refundTransactions) {
    try {
      // Get the original transaction item to find the transaction and customer
      const originalTransactionItem = await prisma.transactionItem.findUnique({
        where: { id: refundData.refundItems[0].originalTransactionItemId },
        include: { transaction: { include: { customer: true } } },
      });

      if (!originalTransactionItem) {
        console.log(
          `❌ Original transaction item ${refundData.refundItems[0].originalTransactionItemId} not found, skipping refund`,
        );
        continue;
      }

      if (!originalTransactionItem.transaction.customerId) {
        console.log(
          `❌ Transaction ${originalTransactionItem.transactionId} has no customer, skipping refund`,
        );
        continue;
      }

      // Create refund transaction
      const refund = await prisma.refund.create({
        data: {
          refundType: refundData.refundType,
          originalTransactionId: originalTransactionItem.transactionId,
          customerId: originalTransactionItem.transaction.customerId!,
          reason: refundData.reason,
          totalRefundAmount: refundData.totalRefundAmount,
          status: RefundStatus.PROCESSED,
          processedAt: new Date(),
          processedBy: 1, // Root admin user
        },
      });

      // Create refund items
      for (const itemData of refundData.refundItems) {
        await prisma.refundItem.create({
          data: {
            refundId: refund.id,
            originalTransactionItemId: itemData.originalTransactionItemId,
            quantityToRefund: itemData.quantityToRefund,
            refundAmount: itemData.refundAmount,
            isWarrantyValid: true, // Assume warranty was valid for seed data
          },
        });
      }

      console.log(
        `✅ Refund created: ${refund.id} - Type: ${refundData.refundType} - Amount: $${refundData.totalRefundAmount.toFixed(2)}`,
      );
    } catch (error) {
      console.log(
        `⚠️ Skipping refund (${refundData.refundType}): Original transaction item may not exist - ${error.message}`,
      );
    }
  }

  console.log('🎉 Database seeding completed successfully!');
  console.log(
    `📊 Processed ${staffUsers.length + 1} users (including root admin)`,
  );
  console.log(`🏭 Processed ${suppliers.length} suppliers`);
  console.log(`👥 Processed ${customers.length} customers`);
  console.log(
    `🔧 Created ${parentItems.length} parent items and ${subItems.length} sub-items`,
  );
  console.log(
    `📦 Total items created: ${parentItems.length + subItems.length}`,
  );
  console.log(
    `📦 Stock records created for all ${parentItems.length + subItems.length} items`,
  );
  console.log(`💳 Created ${paymentAccounts.length} payment accounts`);
  console.log(`🛒 Created ${buyTransactions.length} buy transactions`);
  console.log(`🛍️ Created ${sellTransactions.length} sell transactions`);
  console.log(
    `🚨 Created ${approachingDebtTransactions.length} approaching debt transactions`,
  );
  console.log(`🚨 Created ${dueDebtTransactions.length} due debt transactions`);
  console.log(
    `🚨 Created ${supplierApproachingDebtTransactions.length} supplier approaching debt transactions`,
  );
  console.log(
    `🚨 Created ${supplierDueDebtTransactions.length} supplier due debt transactions`,
  );
  console.log(`🔄 Created ${refundTransactions.length} refund transactions`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
