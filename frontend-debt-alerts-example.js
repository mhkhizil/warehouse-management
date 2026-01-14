// Frontend Debt Alerts Example
// This file demonstrates how to connect to Pusher and listen for debt alerts

// Include Pusher in your HTML:
// <script src="https://js.pusher.com/8.4.0/pusher.min.js"></script>

// Initialize Pusher
const pusher = new Pusher('YOUR_PUSHER_KEY', {
    cluster: 'ap1', // e.g., 'us2', 'eu', 'ap1'
    encrypted: true
});

// Subscribe to the debt-alerts channel
const channel = pusher.subscribe('debt-alerts');

// Listen for debt alerts
channel.bind('debt-alert', function (data) {
    console.log('Debt Alert Received:', data);

    // Create notification based on alert type
    const notification = createDebtNotification(data);
    showNotification(notification);

    // Update UI with debt alert
    updateDebtAlertsUI(data);
});

// Create a notification object
function createDebtNotification(alert) {
    const { type, entityName, amount, dueDate, daysUntilDue, isOverdue, alertType } = alert;

    let title, message, severity;

    if (isOverdue) {
        title = `🚨 OVERDUE DEBT ALERT`;
        message = `${type.toUpperCase()} ${entityName} has an overdue debt of $${amount.toFixed(2)}`;
        severity = 'error';
    } else if (alertType === 'due') {
        title = `⚠️ DEBT DUE TODAY`;
        message = `${type.toUpperCase()} ${entityName} has a debt of $${amount.toFixed(2)} due today`;
        severity = 'warning';
    } else {
        title = `📅 DEBT APPROACHING`;
        message = `${type.toUpperCase()} ${entityName} has a debt of $${amount.toFixed(2)} due in ${daysUntilDue} days`;
        severity = 'info';
    }

    return {
        title,
        message,
        severity,
        data: alert
    };
}

// Show notification (you can use any notification library)
function showNotification(notification) {
    // Example using browser notifications
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
            body: notification.message,
            icon: '/path/to/your/icon.png',
            tag: `debt-alert-${notification.data.id}`
        });
    }

    // Example using a custom notification system
    showCustomNotification(notification);
}

// Custom notification function (implement based on your UI framework)
function showCustomNotification(notification) {
    // Example for React/React Native
    // dispatch(showNotification(notification));

    // Example for Vue
    // this.$notify(notification);

    // Example for Angular
    // this.notificationService.show(notification);

    // Example for vanilla JS
    const notificationElement = document.createElement('div');
    notificationElement.className = `notification notification-${notification.severity}`;
    notificationElement.innerHTML = `
    <h4>${notification.title}</h4>
    <p>${notification.message}</p>
    <button onclick="this.parentElement.remove()">Dismiss</button>
  `;

    document.body.appendChild(notificationElement);

    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (notificationElement.parentElement) {
            notificationElement.remove();
        }
    }, 10000);
}

// Update UI with debt alerts
function updateDebtAlertsUI(alert) {
    // Example: Update a debt alerts list
    const alertsContainer = document.getElementById('debt-alerts-list');
    if (alertsContainer) {
        const alertElement = document.createElement('div');
        alertElement.className = `alert-item alert-${alert.alertType}`;
        alertElement.innerHTML = `
      <div class="alert-header">
        <span class="alert-type">${alert.type.toUpperCase()}</span>
        <span class="alert-amount">$${alert.amount.toFixed(2)}</span>
      </div>
      <div class="alert-body">
        <strong>${alert.entityName}</strong>
        <p>Due: ${new Date(alert.dueDate).toLocaleDateString()}</p>
        <p>Days ${alert.isOverdue ? 'Overdue' : 'Until Due'}: ${Math.abs(alert.daysUntilDue)}</p>
      </div>
      <div class="alert-actions">
        <button onclick="viewDebtDetails(${alert.id}, '${alert.type}')">View Details</button>
        <button onclick="markAsRead(${alert.id})">Mark as Read</button>
      </div>
    `;

        alertsContainer.insertBefore(alertElement, alertsContainer.firstChild);
    }

    // Example: Update dashboard counters
    updateDebtCounters(alert);
}

// Update debt counters on dashboard
function updateDebtCounters(alert) {
    const counters = {
        customer: document.getElementById('customer-debt-count'),
        supplier: document.getElementById('supplier-debt-count'),
        overdue: document.getElementById('overdue-debt-count'),
        dueToday: document.getElementById('due-today-count')
    };

    // Update specific counter based on alert type
    if (alert.isOverdue) {
        if (counters.overdue) {
            counters.overdue.textContent = parseInt(counters.overdue.textContent || '0') + 1;
        }
    } else if (alert.alertType === 'due') {
        if (counters.dueToday) {
            counters.dueToday.textContent = parseInt(counters.dueToday.textContent || '0') + 1;
        }
    }

    // Update type-specific counter
    const typeCounter = counters[alert.type];
    if (typeCounter) {
        typeCounter.textContent = parseInt(typeCounter.textContent || '0') + 1;
    }
}

// Action functions
function viewDebtDetails(debtId, type) {
    // Navigate to debt details page
    window.location.href = `/debts/${type}/${debtId}`;
}

function markAsRead(alertId) {
    // Mark alert as read (you might want to send this to your backend)
    const alertElement = document.querySelector(`[data-alert-id="${alertId}"]`);
    if (alertElement) {
        alertElement.classList.add('read');
    }
}

// Request notification permission
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted');
            }
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function () {
    requestNotificationPermission();

    // Set up periodic checks for new alerts (fallback)
    setInterval(() => {
        // You can also poll your backend for alerts as a fallback
        fetch('/api/debt-alerts/status')
            .then(response => response.json())
            .then(data => {
                console.log('Alert system status:', data);
            })
            .catch(error => {
                console.error('Error checking alert system status:', error);
            });
    }, 300000); // Check every 5 minutes
});

// Example CSS for notifications
const styles = `
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px;
  border-radius: 5px;
  color: white;
  z-index: 1000;
  max-width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.notification-error {
  background-color: #dc3545;
}

.notification-warning {
  background-color: #ffc107;
  color: #212529;
}

.notification-info {
  background-color: #17a2b8;
}

.alert-item {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}

.alert-overdue {
  border-left: 4px solid #dc3545;
  background-color: #f8d7da;
}

.alert-due {
  border-left: 4px solid #ffc107;
  background-color: #fff3cd;
}

.alert-approaching {
  border-left: 4px solid #17a2b8;
  background-color: #d1ecf1;
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet); 