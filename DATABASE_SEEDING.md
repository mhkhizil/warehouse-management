# Database Seeding Guide

This document explains how to seed your Car Auto Parts WMS database with initial data.

## What Gets Seeded

The seed script creates the following data:

### Users (5 total)

- **Root Admin**: `root` with admin privileges
- **Staff Users**: 4 additional staff members with different permission levels
  - John Technician (Full permissions)
  - Sarah Sales (Limited permissions - no item editing or stock management)
  - Mike Inventory (Inventory-focused permissions)
  - Lisa Administrator (Full permissions)

### Suppliers (8 total)

- AutoZone Parts Co.
- CarParts Express
- Motor Masters Supply
- Quick Parts Solutions
- Premium Auto Components
- Budget Parts Warehouse
- European Parts Specialists
- Truck Parts Unlimited

### Customers (12 total)

- Mike's Auto Repair
- Sarah's Car Care
- Quick Fix Garage
- Family Auto Service
- Professional Motors
- Budget Auto Solutions
- Classic Car Restoration
- Truck & Fleet Service
- Import Auto Specialists
- Mobile Auto Repair
- Performance Tuning Shop
- Emergency Roadside Service

### Items (60 total)

#### Parent Items (10 categories)

- **Engine Parts** - $999.99 (Complete engine parts bundle)
- **Brake System** - $599.99 (Complete brake system package)
- **Transmission** - $1,299.99 (Complete transmission package)
- **Suspension** - $899.99 (Complete suspension package)
- **Electrical** - $799.99 (Complete electrical package)
- **Body Parts** - $1,499.99 (Complete body parts package)
- **Interior** - $699.99 (Complete interior package)
- **Exhaust System** - $899.99 (Complete exhaust package)
- **Cooling System** - $649.99 (Complete cooling package)
- **Fuel System** - $749.99 (Complete fuel package)

#### Sub-Items (50 specific parts)

Each category contains 5 specific auto parts with realistic brands, prices, and descriptions. Examples include:

- **Engine**: Piston Rings (Mahle), Camshaft (Comp Cams), Oil Pump (Melling)
- **Brakes**: Brake Pads (Hawk Performance), Rotors (DBA), Lines (Goodridge)
- **Transmission**: Clutch Kit (Exedy), Flywheel (Fidanza), Gear Set (GForce)
- **Suspension**: Coil Springs (Eibach), Shocks (Koni), Sway Bar (Whiteline)
- **Electrical**: Spark Plugs (NGK), Ignition Coils (MSD), Battery (Optima)
- **Body**: Bumpers (OEM), Hood (Carbon Fiber), Mirrors (OEM)
- **Interior**: Seat Covers (Wet Okole), Steering Wheel (Momo), Floor Mats (WeatherTech)
- **Exhaust**: Headers (JBA), Muffler (Flowmaster), Tips (Gibson)
- **Cooling**: Radiator (Koyo), Water Pump (Gates), Fan (Flex-a-lite)
- **Fuel**: Fuel Pump (Walbro), Injectors (Bosch), Filter (Mann)

## How to Run the Seed

### Prerequisites

1. Make sure your database is running and accessible
2. Ensure your `.env` file has the correct `DATABASE_URL`
3. Make sure Prisma is set up and migrations are applied

### Running the Seed

```bash
# Using npm
npm run db:seed

# Using yarn
yarn db:seed

# Or directly with ts-node
npx ts-node prisma/seed.ts
```

### What Happens During Seeding

1. **Root Admin Creation**: Creates a root admin user with email `root@gmail.com` and password `root123456789`
2. **Staff Users**: Creates 4 staff users with password `staff123456` and appropriate permissions
3. **Suppliers**: Creates 8 realistic auto parts suppliers with contact information
4. **Customers**: Creates 12 realistic auto repair businesses and service centers
5. **Items**: Creates 10 parent item categories and 50 specific auto parts with realistic brands and pricing
6. **Stock**: Creates inventory records for all items with realistic quantities and refill alerts

## Default Credentials

### Root Admin

- **Username**: `root`
- **Email**: `root@gmail.com`
- **Password**: `root123456789`
- **Role**: `ADMIN`

### Staff Users

- **Password**: `staff123456` (for all staff accounts)
- **Usernames**: `john_tech`, `sarah_sales`, `mike_inventory`, `lisa_admin`

## Customizing the Seed Data

To modify the seed data:

1. Edit `prisma/seed.ts`
2. Modify the arrays for `staffUsers`, `suppliers`, or `customers`
3. Run the seed script again

**Note**: The seed script uses `upsert` for the root admin (won't duplicate) but `create` for other records. If you need to re-seed, you may need to clear existing data first.

## Troubleshooting

### Common Issues

1. **Database Connection Error**: Check your `.env` file and database connection
2. **Permission Errors**: Ensure your database user has CREATE permissions
3. **Duplicate Key Errors**: Clear existing data before re-seeding

### Resetting the Database

```bash
# Reset database (WARNING: This will delete all data)
npx prisma migrate reset

# Then run the seed
npm run db:seed
```

## Data Structure

All seeded data follows the schema defined in `prisma/schema.prisma`:

- **Users**: Include username, email, phone, role, and hashed passwords
- **Staff**: Include full names, permissions JSON, and user relationships
- **Suppliers**: Include name, contact info, address, and remarks
- **Customers**: Include name, contact info, and address
- **Stock**: Includes realistic quantities (5-25 for bundles, 10-60 for individual parts) and refill alerts

The data is realistic and appropriate for an auto parts warehouse management system.
