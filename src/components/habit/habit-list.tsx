'use client';

import { useHabits } from '@/context/habit-context';
import { useLanguage } from '@/context/language-context';
import { HabitItem } from './habit-item';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useEffect, useState } from 'react';

export function HabitList() {
  const { habits } = useHabits();
  const { t } = useLanguage();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  if (habits.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>{t('no_habits_message')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <HabitItem key={habit.id} habit={habit} />
      ))}
    </div>
  );
}
