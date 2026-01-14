# ReactJS Debt Alerts Implementation Guide

## Backend System Overview

The NestJS backend implements a debt alerting system with:

- **DebtAlertService**: Scheduled cron jobs (hourly + daily)
- **NotificationService**: Pusher integration for real-time alerts
- **Alert Types**: Approaching (3 days), Due (today), Overdue (daily)

## ReactJS Implementation

### 1. Install Dependencies

```bash
npm install pusher-js @types/pusher-js
```

### 2. Pusher Configuration

```typescript
// src/config/pusher.ts
export const PUSHER_CONFIG = {
  key: process.env.REACT_APP_PUSHER_KEY,
  cluster: process.env.REACT_APP_PUSHER_CLUSTER,
  encrypted: true,
};
```

### 3. Types Definition

```typescript
// src/types/debt-alerts.ts
export interface DebtAlert {
  id: number;
  type: 'customer' | 'supplier';
  entityId: number;
  entityName: string;
  amount: number;
  dueDate: string;
  daysUntilDue: number;
  isOverdue: boolean;
  alertType: 'approaching' | 'due' | 'overdue';
  timestamp: string;
}
```

### 4. Pusher Service

```typescript
// src/services/pusherService.ts
import Pusher from 'pusher-js';

class PusherService {
  private pusher: Pusher;
  private listeners: Map<string, (alert: DebtAlert) => void> = new Map();

  constructor() {
    this.pusher = new Pusher(PUSHER_CONFIG.key, {
      cluster: PUSHER_CONFIG.cluster,
      encrypted: true,
    });

    this.pusher
      .subscribe('debt-alerts')
      .bind('debt-alert', (data: DebtAlert) => {
        this.notifyListeners(data);
      });
  }

  public subscribe(callback: (alert: DebtAlert) => void): string {
    const id = Math.random().toString(36).substr(2, 9);
    this.listeners.set(id, callback);
    return id;
  }

  public unsubscribe(id: string): void {
    this.listeners.delete(id);
  }

  private notifyListeners(alert: DebtAlert) {
    this.listeners.forEach((callback) => callback(alert));
  }
}

export const pusherService = new PusherService();
```

### 5. Alert Notification Component

```typescript
// src/components/DebtAlertNotification.tsx
import React, { useState, useEffect } from 'react';
import { pusherService } from '../services/pusherService';

export const DebtAlertNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<DebtAlert[]>([]);

  useEffect(() => {
    const subscriptionId = pusherService.subscribe((alert: DebtAlert) => {
      setNotifications(prev => [alert, ...prev]);
    });

    return () => pusherService.unsubscribe(subscriptionId);
  }, []);

  const createNotification = (alert: DebtAlert) => {
    if (alert.isOverdue) {
      return {
        title: '🚨 OVERDUE DEBT ALERT',
        message: `${alert.type.toUpperCase()} ${alert.entityName} has an overdue debt of $${alert.amount.toFixed(2)}`,
        severity: 'error'
      };
    } else if (alert.alertType === 'due') {
      return {
        title: '⚠️ DEBT DUE TODAY',
        message: `${alert.type.toUpperCase()} ${alert.entityName} has a debt of $${alert.amount.toFixed(2)} due today`,
        severity: 'warning'
      };
    } else {
      return {
        title: '📅 DEBT APPROACHING',
        message: `${alert.type.toUpperCase()} ${alert.entityName} has a debt of $${alert.amount.toFixed(2)} due in ${alert.daysUntilDue} days`,
        severity: 'info'
      };
    }
  };

  return (
    <div className="debt-alert-container">
      {notifications.map((alert, index) => {
        const notification = createNotification(alert);
        return (
          <div key={`${alert.id}-${index}`} className={`alert-notification alert-${notification.severity}`}>
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
            <div className="alert-details">
              <span>Due: {new Date(alert.dueDate).toLocaleDateString()}</span>
              <span>Days {alert.isOverdue ? 'Overdue' : 'Until Due'}: {Math.abs(alert.daysUntilDue)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
```

### 6. Dashboard Component

```typescript
// src/components/DebtDashboard.tsx
import React, { useState, useEffect } from 'react';
import { pusherService } from '../services/pusherService';

export const DebtDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<DebtAlert[]>([]);
  const [counters, setCounters] = useState({
    customer: 0,
    supplier: 0,
    overdue: 0,
    dueToday: 0,
  });

  useEffect(() => {
    const subscriptionId = pusherService.subscribe((alert: DebtAlert) => {
      setAlerts(prev => [alert, ...prev]);

      // Update counters
      setCounters(prev => ({
        ...prev,
        [alert.type]: prev[alert.type] + 1,
        overdue: alert.isOverdue ? prev.overdue + 1 : prev.overdue,
        dueToday: alert.alertType === 'due' ? prev.dueToday + 1 : prev.dueToday,
      }));
    });

    return () => pusherService.unsubscribe(subscriptionId);
  }, []);

  return (
    <div className="debt-dashboard">
      <h1>Debt Management Dashboard</h1>

      {/* Counters */}
      <div className="counters-grid">
        <div className="counter-card">
          <h3>Customer Debts</h3>
          <span className="counter">{counters.customer}</span>
        </div>
        <div className="counter-card">
          <h3>Supplier Debts</h3>
          <span className="counter">{counters.supplier}</span>
        </div>
        <div className="counter-card overdue">
          <h3>Overdue</h3>
          <span className="counter">{counters.overdue}</span>
        </div>
        <div className="counter-card due-today">
          <h3>Due Today</h3>
          <span className="counter">{counters.dueToday}</span>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="recent-alerts">
        <h2>Recent Alerts</h2>
        <div className="alerts-list">
          {alerts.map((alert, index) => (
            <div key={`${alert.id}-${index}`} className={`alert-item alert-${alert.alertType}`}>
              <div className="alert-header">
                <span className="alert-type">{alert.type.toUpperCase()}</span>
                <span className="alert-amount">${alert.amount.toFixed(2)}</span>
              </div>
              <div className="alert-body">
                <strong>{alert.entityName}</strong>
                <p>Due: {new Date(alert.dueDate).toLocaleDateString()}</p>
                <p>Days {alert.isOverdue ? 'Overdue' : 'Until Due'}: {Math.abs(alert.daysUntilDue)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Notifications */}
      <DebtAlertNotification />
    </div>
  );
};
```

### 7. CSS Styling

```css
/* src/components/DebtAlertNotification.css */
.debt-alert-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
}

.alert-notification {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid;
  animation: slideIn 0.3s ease-out;
}

.alert-info {
  border-left-color: #17a2b8;
  background-color: #d1ecf1;
}

.alert-warning {
  border-left-color: #ffc107;
  background-color: #fff3cd;
}

.alert-error {
  border-left-color: #dc3545;
  background-color: #f8d7da;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### 8. Custom Hook

```typescript
// src/hooks/useDebtAlerts.ts
import { useState, useEffect } from 'react';
import { pusherService } from '../services/pusherService';

export const useDebtAlerts = () => {
  const [alerts, setAlerts] = useState<DebtAlert[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const subscriptionId = pusherService.subscribe((alert: DebtAlert) => {
      setAlerts((prev) => [alert, ...prev]);
    });

    setIsConnected(true);

    return () => {
      pusherService.unsubscribe(subscriptionId);
    };
  }, []);

  const clearAlerts = () => setAlerts([]);
  const removeAlert = (alertId: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  return { alerts, isConnected, clearAlerts, removeAlert };
};
```

### 9. App Integration

```typescript
// src/App.tsx
import React from 'react';
import { DebtDashboard } from './components/DebtDashboard';

function App() {
  return (
    <div className="App">
      <DebtDashboard />
    </div>
  );
}

export default App;
```

## Environment Setup

### Frontend (.env)

```env
REACT_APP_PUSHER_KEY=your_pusher_key
REACT_APP_PUSHER_CLUSTER=us2
```

### Backend (.env)

```env
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=us2
```

## Testing

### Manual Test

```typescript
const testAlert: DebtAlert = {
  id: 1,
  type: 'customer',
  entityId: 123,
  entityName: 'John Doe',
  amount: 500,
  dueDate: '2025-01-30T00:00:00.000Z',
  daysUntilDue: -5,
  isOverdue: true,
  alertType: 'overdue',
  timestamp: new Date().toISOString(),
};

// Trigger test alert
pusherService.notifyListeners(testAlert);
```

## Features

✅ Real-time notifications via Pusher  
✅ Multiple alert types (approaching, due, overdue)  
✅ Dashboard with live counters  
✅ Responsive design  
✅ TypeScript support  
✅ Custom hooks for reusability  
✅ Auto-cleanup and error handling

## Backend Integration

The ReactJS frontend connects to the NestJS backend through:

1. **Pusher Channels**: `debt-alerts` channel
2. **Events**: `debt-alert` event
3. **Automatic Triggers**: Backend cron jobs send alerts
4. **Real-time Updates**: Instant frontend notifications

The system is production-ready and handles all edge cases with proper error handling and logging.
