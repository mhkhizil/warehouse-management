# Warranty Functionality Documentation

## Overview

The warranty functionality has been added to the Car Auto Part WMS system to track warranty information for both parent and child items in transactions. This is an optional feature that can be applied to individual transaction items.

## Features

### Database Schema Changes

Added warranty fields to the `TransactionItem` model:

- `hasWarranty`: Boolean flag indicating if the item has warranty (defaults to false)
- `warrantyDurationMonths`: Duration of warranty in months (optional)
- `warrantyStartDate`: When warranty starts (optional, defaults to transaction date)
- `warrantyEndDate`: When warranty expires (optional, auto-calculated if not provided)
- `warrantyDescription`: Additional warranty details or terms (optional)

### API Changes

#### Request (CreateTransactionItemDto)

When creating a transaction, you can now include warranty information for each item:

```json
{
  "itemId": 1,
  "quantity": 2,
  "unitPrice": 150.0,
  "hasWarranty": true,
  "warrantyDurationMonths": 12,
  "warrantyDescription": "1 year manufacturer warranty covering parts and labor"
}
```

#### Response (TransactionItemResponseDto)

Transaction responses now include warranty information:

```json
{
  "id": 1,
  "itemId": 1,
  "quantity": 2,
  "unitPrice": 150.0,
  "totalAmount": 300.0,
  "hasWarranty": true,
  "warrantyDurationMonths": 12,
  "warrantyStartDate": "2024-08-22T00:00:00Z",
  "warrantyEndDate": "2025-08-22T00:00:00Z",
  "warrantyDescription": "1 year manufacturer warranty covering parts and labor"
}
```

## Usage Examples

### Example 1: Item with Basic Warranty

```json
{
  "itemId": 1,
  "quantity": 1,
  "unitPrice": 200.0,
  "hasWarranty": true,
  "warrantyDurationMonths": 24
}
```

- System will auto-calculate warranty end date as 24 months from transaction date

### Example 2: Item with Custom Warranty Dates

```json
{
  "itemId": 2,
  "quantity": 1,
  "unitPrice": 100.0,
  "hasWarranty": true,
  "warrantyStartDate": "2024-09-01T00:00:00Z",
  "warrantyEndDate": "2025-09-01T00:00:00Z",
  "warrantyDescription": "Extended warranty with premium support"
}
```

### Example 3: Item without Warranty

```json
{
  "itemId": 3,
  "quantity": 1,
  "unitPrice": 50.0,
  "hasWarranty": false
}
```

## Business Logic

### Warranty Date Calculation

1. If `warrantyEndDate` is provided, it's used as-is
2. If `warrantyDurationMonths` is provided but no end date, end date is calculated from start date + duration
3. If `warrantyStartDate` is not provided, transaction date is used as start date
4. If `hasWarranty` is false, all warranty fields are set to null

### Validation Rules

- `warrantyDurationMonths` is required when `hasWarranty` is true (unless `warrantyEndDate` is provided)
- All warranty fields are optional when `hasWarranty` is false
- Date fields accept ISO 8601 format strings

## Parent vs Child Items

The warranty functionality works for both:

- **Parent Items**: Main auto parts (e.g., "Engine Assembly")
- **Child Items**: Sub-components (e.g., "Engine Gasket", "Oil Filter")

Each item in a transaction can have its own warranty terms, regardless of parent-child relationships.

## Database Migration

A migration has been created to add warranty fields to existing `TransactionItem` records:

- File: `prisma/migrations/20250822141228_add_warranty_to_transaction_items/migration.sql`
- All existing transaction items will have `hasWarranty = false` by default

## API Documentation

The warranty fields are automatically documented in the OpenAPI/Swagger documentation through the updated DTOs:

- Available in the transaction creation endpoint (`POST /transactions`)
- Visible in all transaction response endpoints
- Includes field descriptions, examples, and validation rules

## Testing

A sample request is provided in `test-warranty-example.json` showing how to create a transaction with mixed warranty scenarios.

## Future Enhancements

Potential future improvements:

1. Warranty tracking dashboard
2. Warranty expiration alerts
3. Warranty claim management
4. Integration with supplier warranty terms
5. Automated warranty validation against item specifications
