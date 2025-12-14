// Socket.IO client - Real backend only
import { io, Socket } from 'socket.io-client';

class SocketManager {
  private socket: Socket | null = null;

  initialize(): Socket {
    if (this.socket) {
      return this.socket;
    }

    const token = localStorage.getItem('kloudspot_token');
    if (!token) {
      console.warn('⚠️ No authentication token available for socket connection');
      throw new Error('No authentication token available');
    }

    console.log('🔌 Initializing socket connection...');
    this.socket = io(import.meta.env.VITE_API_BASE, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected successfully:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    // Listen for live occupancy updates
    this.socket.on('live-occupancy', (data) => {
      console.log('📊 Live occupancy update received:', data);
    });

    // Listen for alerts (notifications)
    this.socket.on('alert', (data) => {
      console.log('🚨 Real-time alert received:', data);
    });

    // Log all socket events for debugging
    this.socket.onAny((eventName, ...args) => {
      console.log(`🔔 Socket event '${eventName}':`, args);
      
      // Log alert events (don't filter - let the handler decide)
      if (eventName === 'alert') {
        const alertData = args[0];
        console.log('📨 Alert event format:', {
          hasDirection: !!alertData?.direction,
          hasPersonName: !!alertData?.personName,
          hasAction: !!alertData?.action,
          hasZone: !!alertData?.zone
        });
      }
    });

    return this.socket;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  updateAuth(token: string | null): void {
    if (this.socket && token) {
      this.socket.auth = { token };
      if (this.socket.connected) {
        this.socket.disconnect();
        this.socket.connect();
      }
    }
  }
}

export const socketManager = new SocketManager();