// Alerts slide-in panel component matching notification.png design
import React, { useState, useEffect } from 'react';
import { Bell, X, Clock, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications, Notification } from '../hooks/useNotifications';

export const NotificationsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close panel on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (notification.unread) {
      markAsRead(notification.id);
    }

    // Navigate if target URL exists
    if (notification.targetUrl) {
      navigate(notification.targetUrl);
      setIsOpen(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'success':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Bell icon trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span 
            className="absolute -top-1 -right-1 h-5 w-5 text-white text-xs rounded-full flex items-center justify-center font-medium"
            style={{
              background: 'radial-gradient(circle, #ef4444 0%, #dc2626 70%)',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.4)',
              filter: 'blur(0.5px)'
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Full-screen overlay and slide-in panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Dark background overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Slide-in panel from right */}
          <div className={`ml-auto h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            {/* Panel Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <Bell className="h-6 w-6 text-gray-700" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Alerts</h2>
                  {unreadCount > 0 && (
                    <p className="text-sm text-gray-500">{unreadCount} unread alerts</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mark all read button */}
            {unreadCount > 0 && (
              <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  Mark all as read
                </button>
              </div>
            )}

            {/* Notifications list */}
            <div className="flex-1 overflow-y-auto h-full p-4">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <Bell className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts</h3>
                  <p className="text-gray-500">You're all caught up! New alerts will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`relative bg-white rounded-lg border shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 p-4 ${
                        notification.unread 
                          ? 'border-blue-200 bg-blue-50/50 shadow-blue-100/50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* Unread indicator */}
                      {notification.unread && (
                        <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}

                      <div className="flex items-start space-x-3">
                        {/* Severity icon with colored background */}
                        <div className={`flex-shrink-0 p-2 rounded-full ${
                          notification.severity === 'critical' ? 'bg-red-100' :
                          notification.severity === 'warning' ? 'bg-yellow-100' :
                          notification.severity === 'success' ? 'bg-green-100' :
                          'bg-blue-100'
                        }`}>
                          {getSeverityIcon(notification.severity)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-semibold mb-1 ${
                            notification.unread ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          <p className={`text-sm leading-relaxed mb-2 ${
                            notification.unread ? 'text-gray-700' : 'text-gray-500'
                          }`}>
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatTimestamp(notification.timestamp)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Severity indicator bar */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${getSeverityColor(notification.severity)}`}></div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm text-teal-600 hover:text-teal-700 font-medium py-2"
                >
                  Close alerts
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};