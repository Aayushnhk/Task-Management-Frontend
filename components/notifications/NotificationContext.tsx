// components/notifications/NotificationContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface NotificationContextType {
  notify: (message: string, type: Notification['type']) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = (message: string, type: Notification['type']) => {
    const id = Date.now();
    const newNotification = { id, message, type };
    
    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <NotificationDisplay notifications={notifications} setNotifications={setNotifications} />
    </NotificationContext.Provider>
  );
};

const NotificationDisplay: React.FC<{
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}> = ({ notifications, setNotifications }) => {
    
    const removeNotification = (id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const getStyles = (type: Notification['type']) => {
        switch (type) {
            case 'success': 
                return 'bg-gradient-to-r from-green-600 to-emerald-700 border-green-500 shadow-lg shadow-green-500/25';
            case 'error': 
                return 'bg-gradient-to-r from-red-600 to-rose-700 border-red-500 shadow-lg shadow-red-500/25';
            default: 
                return 'bg-gradient-to-r from-blue-600 to-cyan-700 border-blue-500 shadow-lg shadow-blue-500/25';
        }
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                );
            case 'error':
                return (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                );
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
            {notifications.map((n) => (
                <div
                    key={n.id}
                    className={`p-4 text-white rounded-xl border backdrop-blur-sm transform transition-all duration-300 ease-out cursor-pointer hover:scale-105 ${getStyles(n.type)}`}
                    onClick={() => removeNotification(n.id)}
                >
                    <div className="flex items-start space-x-3">
                        <div className="shrink-0 mt-0.5">
                            {getIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold capitalize">{n.type}</p>
                            <p className="text-sm opacity-90 mt-1">{n.message}</p>
                        </div>
                        <button className="shrink-0 opacity-70 hover:opacity-100 transition-opacity">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};