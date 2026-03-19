/**
 * Alert and notification state management store
 * Manages system alerts, warnings, and critical notifications
 */

import { create } from 'zustand';
import { Alert, AlertSeverity } from '@/domain/types';
import { mockAlerts } from '@/data/mockData';

interface AlertStore {
  alerts: Alert[];
  
  /**
   * Adds a new alert to the system
   * TODO: Replace with real-time alert stream from backend
   */
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>) => void;
  
  /**
   * Marks an alert as acknowledged by the user
   * TODO: Replace with API call to persist acknowledgment
   */
  acknowledgeAlert: (alertId: string) => void;
  
  /**
   * Gets all unacknowledged alerts
   */
  getUnacknowledgedAlerts: () => Alert[];
  
  /**
   * Gets alerts filtered by severity
   */
  getAlertsBySeverity: (severity: AlertSeverity) => Alert[];
}

export const useAlertStore = create<AlertStore>((set, get) => ({
  alerts: mockAlerts,

  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>) => {
    const newAlert: Alert = {
      ...alert,
      id: `alert-${Date.now()}`,
      timestamp: Date.now(),
      acknowledged: false,
    };
    set((state) => ({
      alerts: [newAlert, ...state.alerts],
    }));
  },

  acknowledgeAlert: (alertId: string) => {
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ),
    }));
  },

  getUnacknowledgedAlerts: () => {
    return get().alerts.filter((alert) => !alert.acknowledged);
  },

  getAlertsBySeverity: (severity: AlertSeverity) => {
    return get().alerts.filter((alert) => alert.severity === severity);
  },
}));
