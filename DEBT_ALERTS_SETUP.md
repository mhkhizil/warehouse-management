# Debt Alerting System Setup Guide

This guide explains how to set up and use the debt alerting system that automatically notifies the frontend about customer and supplier debt deadlines using Pusher.

## 🚀 Features

- **Automatic Alerts**: Checks for debt deadlines every hour
- **Multiple Alert Types**:
  - **Approaching**: 3 days before due date
  - **Due**: On the due date
  - **Overdue**: Daily after the due date
- **Real-time Notifications**: Uses Pusher for instant frontend updates
- **Smart Alert Management**: Prevents duplicate alerts using `alertSent` flags
- **Admin Controls**: Manual trigger and reset capabilities for testing

## 📋 Prerequisites

1. **Pusher Account**: Sign up at [pusher.com](https://pusher.com)
2. **Environment Variables**: Configure Pusher credentials
3. **NestJS Schedule**: Already installed (`@nestjs/schedule`)

## 🔧 Environment Setup

Add these variables to your `.env` file:

```env
# Pusher Configuration
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_pusher_cluster

# Example:
# PUSHER_APP_ID=1234567
# PUSHER_KEY=abcdef123456
# PUSHER_SECRET=3e7c27c41a550effed0a
# PUSHER_CLUSTER=us2
```

## 🏗️ System Architecture

### Backend Components

1. **DebtAlertService** (`src/core/common/pusher/DebtAlertService.ts`)

   - Scheduled cron jobs for automatic checking
   - Logic for determining alert types
   - Pusher integration for real-time notifications

2. **NotificationService** (`src/core/common/pusher/NotificationService.ts`)

   - Pusher client configuration
   - Debt alert notification methods

3. **DebtAlertsController** (`src/application/controller/debt-alerts.controller.ts`)
   - Manual trigger endpoints for testing
   - System status monitoring

### Database Schema

Both `Debt` and `SupplierDebt` models already have:

- `alertSent: Boolean` - Prevents duplicate alerts
- `dueDate: DateTime` - Used for deadline calculations
- `isSettled: Boolean` - Only unsettled debts trigger alerts

## ⏰ Alert Schedule

### Automatic Checks

1. **Hourly Check** (`@Cron(CronExpression.EVERY_HOUR)`)

   - Checks for debts due within 3 days
   - Sends alerts for approaching, due, and overdue debts
   - Marks `alertSent = true` to prevent duplicates

2. **Daily Check** (`@Cron('0 9 * * *')` - 9 AM daily)
   - Checks for all overdue debts
   - Sends daily reminders for overdue debts
   - No duplicate prevention (daily reminders are intentional)

### Alert Types

| Type            | Trigger           | Description                      |
| --------------- | ----------------- | -------------------------------- |
| **Approaching** | 3 days before due | Warning about upcoming deadline  |
| **Due**         | On due date       | Alert that debt is due today     |
| **Overdue**     | After due date    | Daily reminder for overdue debts |

## 🎯 Alert Logic

### Customer Debts

```typescript
// Checks customer debts that are:
- isSettled: false
- dueDate <= 3 days from now
- alertSent: false (for initial alerts)
```

### Supplier Debts

```typescript
// Checks supplier debts that are:
- isSettled: false
- dueDate <= 3 days from now
- alertSent: false (for initial alerts)
```

## 📡 Pusher Integration

### Channel: `debt-alerts`

### Event: `debt-alert`

### Alert Payload Structure

```typescript
{
  id: number; // Debt ID
  type: 'customer' | 'supplier';
  entityId: number; // Customer/Supplier ID
  entityName: string; // Customer/Supplier name
  amount: number; // Debt amount
  dueDate: string; // ISO date string
  daysUntilDue: number; // Negative for overdue
  isOverdue: boolean;
  alertType: 'approaching' | 'due' | 'overdue';
  timestamp: string; // ISO timestamp
}
```

## 🧪 Testing the System

### 1. Manual Trigger

```bash
# Trigger debt alerts manually
curl -X POST "http://localhost:3000/debt-alerts/trigger" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-CSRF-Token: YOUR_CSRF_TOKEN"
```

### 2. Reset Alert Flags

```bash
# Reset alert flags for testing
curl -X POST "http://localhost:3000/debt-alerts/reset-flags" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-CSRF-Token: YOUR_CSRF_TOKEN"
```

### 3. Check System Status

```bash
# Get alert system status
curl -X GET "http://localhost:3000/debt-alerts/status" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🎨 Frontend Integration

### 1. Include Pusher

```html
<script src="https://js.pusher.com/8.4.0/pusher.min.js"></script>
```

### 2. Initialize Connection

```javascript
const pusher = new Pusher('YOUR_PUSHER_KEY', {
  cluster: 'YOUR_PUSHER_CLUSTER',
  encrypted: true,
});
```

### 3. Subscribe to Alerts

```javascript
const channel = pusher.subscribe('debt-alerts');

channel.bind('debt-alert', function (data) {
  console.log('Debt Alert:', data);
  // Handle the alert (show notification, update UI, etc.)
});
```

### 4. Complete Example

See `frontend-debt-alerts-example.js` for a complete implementation including:

- Notification creation
- UI updates
- Dashboard counters
- CSS styling

## 🔍 Monitoring and Debugging

### Logs

The system logs all activities:

- `Checking for debt alerts...`
- `Debt alert sent for customer John Doe: approaching`
- `Error checking debt alerts: [error details]`

### Database Queries

Monitor these queries for debugging:

```sql
-- Customer debts due soon
SELECT * FROM "Debt"
WHERE "isSettled" = false
AND "dueDate" <= NOW() + INTERVAL '3 days'
AND "alertSent" = false;

-- Supplier debts due soon
SELECT * FROM "SupplierDebt"
WHERE "isSettled" = false
AND "dueDate" <= NOW() + INTERVAL '3 days'
AND "alertSent" = false;
```

## 🚨 Troubleshooting

### Common Issues

1. **No alerts being sent**

   - Check Pusher credentials in `.env`
   - Verify `alertSent` flags are reset
   - Check server logs for errors

2. **Duplicate alerts**

   - Ensure `alertSent` is being set to `true`
   - Check if multiple instances are running

3. **Frontend not receiving alerts**
   - Verify Pusher key and cluster
   - Check browser console for connection errors
   - Ensure channel subscription is working

### Debug Commands

```bash
# Check if scheduler is running
curl -X GET "http://localhost:3000/debt-alerts/status"

# Manually trigger alerts
curl -X POST "http://localhost:3000/debt-alerts/trigger"

# Reset flags for testing
curl -X POST "http://localhost:3000/debt-alerts/reset-flags"
```

## 📊 Performance Considerations

- **Database Indexes**: Ensure indexes on `dueDate`, `isSettled`, and `alertSent`
- **Batch Processing**: Large debt tables may need pagination
- **Pusher Limits**: Monitor Pusher usage and rate limits
- **Memory Usage**: Long-running processes should be monitored

## 🔐 Security

- All endpoints require JWT authentication
- Admin-only endpoints for manual triggers
- CSRF protection on state-changing operations
- Pusher channels are public (consider private channels for sensitive data)

## 📈 Future Enhancements

1. **Email Notifications**: Send email alerts in addition to Pusher
2. **SMS Alerts**: Critical overdue debts via SMS
3. **Escalation Rules**: Different alert levels based on amount
4. **Custom Schedules**: Configurable alert timing per debt type
5. **Alert History**: Track all sent alerts for audit purposes

## 📞 Support

For issues or questions:

1. Check server logs for error details
2. Verify Pusher configuration
3. Test with manual trigger endpoints
4. Review database queries and data

---

**Note**: This system is designed to be robust and handle edge cases. Always test thoroughly in a development environment before deploying to production.
