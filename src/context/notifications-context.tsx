'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';

interface NotificationsContextType {
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  requestPermission: (showAlerts?: boolean) => Promise<boolean>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEnabled, setIsEnabled] = useLocalStorage('notificationsEnabled', false);
  const { toast } = useToast();

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted' && !isEnabled) {
      setIsEnabled(true);
    }
  }, [isEnabled, setIsEnabled]);

  const requestPermission = useCallback(async (showAlerts = true): Promise<boolean> => {
    if (!('Notification' in window)) {
      if (showAlerts) {
        toast({ title: 'Notifications not supported', description: 'This browser does not support desktop notification.', variant: 'destructive' });
      }
      setIsEnabled(false);
      return false;
    }

    if (Notification.permission === 'granted') {
      if (!isEnabled) setIsEnabled(true);
      return true;
    }

    if (Notification.permission === 'denied') {
      if (showAlerts) {
        toast({ title: 'Notification permission denied', description: 'Please enable notifications in your browser settings.', variant: 'destructive' });
      }
      setIsEnabled(false);
      return false;
    }
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setIsEnabled(true);
      if (showAlerts) {
        toast({ title: 'Notifications Enabled', description: 'You will now receive reminders.' });
      }
      return true;
    } else {
      setIsEnabled(false);
      if (showAlerts) {
        toast({ title: 'Notifications Disabled', description: 'Permission was not granted.' });
      }
      return false;
    }
  }, [setIsEnabled, toast, isEnabled]);

  const toggleNotifications = useCallback(async () => {
    if (!isEnabled) {
      await requestPermission(true);
    } else {
      setIsEnabled(false);
      toast({ title: 'Notifications Disabled', description: 'You will no longer receive reminders.' });
    }
  }, [isEnabled, requestPermission, setIsEnabled, toast]);

  return (
    <NotificationsContext.Provider value={{ notificationsEnabled: isEnabled, toggleNotifications, requestPermission }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
