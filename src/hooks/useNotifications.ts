// Notifications hook - Real Socket.IO events only (no REST API)
import { useState, useCallback, useEffect } from 'react';
import { useAlerts, AlertData } from './useSocket';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  unread: boolean;
  targetUrl?: string;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Handle real-time alerts from socket
  const handleAlert = useCallback((alertData: AlertData) => {
    console.log('🚨 Real-time alert received:', alertData);
    
    // Handle real backend format
    if (alertData.direction && alertData.personName) {
      // Convert timestamp
      const validTimestamp = alertData.ts ? new Date(alertData.ts).toISOString() : new Date().toISOString();
      
      // Map direction to action
      const action = alertData.direction.includes('entry') ? 'entry' : 'exit';
      
      // Map severity
      const severity = alertData.severity === 'high' ? 'critical' : 
                      alertData.severity === 'medium' ? 'warning' : 'info';
      
      const notification: Notification = {
        id: alertData.eventId || `alert_${Date.now()}_${Math.random()}`,
        title: `${action === 'entry' ? 'Entry' : 'Exit'} Alert`,
        message: `${alertData.personName} ${action === 'entry' ? 'entered' : 'exited'} the venue`,
        timestamp: validTimestamp,
        severity,
        unread: true,
        targetUrl: '/crowd-entries'
      };

      setNotifications(prev => [notification, ...prev]);
      return;
    }
    
    // Legacy format validation (for compatibility)
    if (!alertData || !alertData.action || !alertData.zone || !alertData.details) {
      console.warn('⚠️ Invalid alert data received, ignoring:', alertData);
      return;
    }
    
    // Handle legacy format
    let validTimestamp: string;
    try {
      const date = new Date(alertData.timestamp || Date.now());
      validTimestamp = date.toISOString();
    } catch (error) {
      validTimestamp = new Date().toISOString();
    }
    
    const notification: Notification = {
      id: `alert_${Date.now()}_${Math.random()}`,
      title: `${alertData.action === 'entry' ? 'Entry' : 'Exit'} Alert`,
      message: alertData.details,
      timestamp: validTimestamp,
      severity: alertData.severity || 'info',
      unread: true,
      targetUrl: '/crowd-entries'
    };

    setNotifications(prev => [notification, ...prev]);
  }, []);

  // Subscribe to socket alerts - this is the ONLY source of notifications
  useAlerts(handleAlert);

  // Log when notifications hook initializes
  useEffect(() => {
    console.log('📱 Notifications system initialized - listening for real-time socket events');
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, unread: false }))
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll
  };
};