'use client';

import { useTheme } from 'next-themes';
import { useLanguage } from '@/context/language-context';
import { useNotifications } from '@/context/notifications-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, Bell, BellOff, Languages } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';
import { useEffect, useState } from 'react';

export function AppHeader() {
  const { setTheme, theme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { notificationsEnabled, toggleNotifications } = useNotifications();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <h1 className="font-headline text-lg font-bold">{isClient ? t('app_title') : 'Habit Hacker'}</h1>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Languages className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  disabled={language.code === lang.code}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={toggleNotifications} aria-label={isClient ? (notificationsEnabled ? t('notifications_enabled') : t('notifications_disabled')) : 'Toggle notifications'}>
            {notificationsEnabled ? (
              <Bell className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <BellOff className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Toggle theme">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </div>
    </header>
  );
}
