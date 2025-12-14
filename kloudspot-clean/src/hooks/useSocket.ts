// Socket hook - Real backend only
import { useEffect, useRef } from 'react';
import { socketManager } from '../socket/socket';

export interface LiveOccupancyData {
  zoneId: string;
  siteId: string;
  occupancy: number;
  timestamp: string;
}

export interface AlertData {
  // Real backend format
  direction: 'entry' | 'exit' | 'zone-entry' | 'zone-exit';
  personName: string;
  severity: 'high' | 'medium' | 'low' | 'info' | 'warning' | 'critical' | 'success';
  ts: number;
  eventId: string;
  // Legacy format (for compatibility)
  action?: 'entry' | 'exit';
  zone?: string;
  site?: string;
  details?: string;
  timestamp?: string;
}

export function useSocket<T = any>(
  eventName: string,
  handler: (data: T) => void,
  dependencies: any[] = []
): {
  isConnected: boolean;
  socket: any;
} {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    try {
      const socket = socketManager.initialize();

      const eventHandler = (data: T) => {
        handlerRef.current(data);
      };

      socket.on(eventName, eventHandler);

      return () => {
        socket.off(eventName, eventHandler);
      };
    } catch (error) {
      console.error('Socket initialization failed:', error);
    }
  }, [eventName, ...dependencies]);

  return {
    isConnected: socketManager.isConnected(),
    socket: socketManager.getSocket()
  };
}

export function useLiveOccupancy(handler: (data: LiveOccupancyData) => void) {
  return useSocket<LiveOccupancyData>('live-occupancy', handler);
}

export function useAlerts(handler: (data: AlertData) => void) {
  return useSocket<AlertData>('alert', handler);
}