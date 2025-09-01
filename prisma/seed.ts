import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

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
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
