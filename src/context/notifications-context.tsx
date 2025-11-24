'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from './language-context';

interface NotificationsContextType {
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  requestPermission: (showAlerts?: boolean) => Promise<boolean>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEnabled, setIsEnabled] = useLocalStorage('notificationsEnabled', false);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted' && !isEnabled) {
        setIsEnabled(true);
      }
    }
  }, [isEnabled, setIsEnabled]);

  const requestPermission = useCallback(async (showAlerts = true): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      if (showAlerts) {
        toast({ title: t('notifications_not_supported_title'), description: t('notifications_not_supported_desc'), variant: 'destructive' });
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
        toast({ title: t('notification_permission_denied_title'), description: t('notification_permission_denied_desc'), variant: 'destructive' });
      }
      setIsEnabled(false);
      return false;
    }
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setIsEnabled(true);
      if (showAlerts) {
        toast({ title: t('notifications_enabled_title'), description: t('notifications_enabled_desc') });
      }
      return true;
    } else {
      setIsEnabled(false);
      if (showAlerts) {
        toast({ title: t('notification_permission_denied_title'), description: t('notification_permission_denied_desc'), variant: 'destructive' });
      }
      return false;
    }
  }, [setIsEnabled, toast, isEnabled, t]);

  const toggleNotifications = useCallback(async () => {
    if (!isEnabled) {
      await requestPermission(true);
    } else {
      setIsEnabled(false);
      toast({ title: t('notifications_disabled_title'), description: t('notifications_disabled_desc') });
    }
  }, [isEnabled, requestPermission, setIsEnabled, toast, t]);

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
