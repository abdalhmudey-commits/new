'use client';

import type { Habit } from '@/lib/types';
import { useHabits } from '@/context/habit-context';
import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, MessageSquare, Mic } from 'lucide-react';

interface HabitItemProps {
  habit: Habit;
}

export function HabitItem({ habit }: HabitItemProps) {
  const { deleteHabit } = useHabits();
  const { t } = useLanguage();

  const timeAgo = (date: number) => {
    const seconds = Math.floor((Date.now() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  }

  const getFrequencyText = () => {
    const unitKey = `time_unit_${habit.timeUnit}`;
    return `${habit.frequency} ${t(unitKey)}`;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>{habit.name}</CardTitle>
                <CardDescription>{habit.description}</CardDescription>
            </div>
            {habit.reminderType === 'text' ? 
                <MessageSquare className="w-5 h-5 text-muted-foreground" /> : 
                <Mic className="w-5 h-5 text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {t('reminder_msg_label')}: {habit.reminderType === 'text' ? `"${habit.reminderMessage}"` : t('audio_recorded_status')}
        </p>
        <p className="text-sm text-muted-foreground">
          {t('frequency_label')}: {getFrequencyText()}
        </p>
        
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Added: {timeAgo(habit.createdAt)}
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              {t('delete_habit_button')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('delete_habit_confirm_title')}</AlertDialogTitle>
              <AlertDialogDescription>{t('delete_habit_confirm_desc')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteHabit(habit.id)}>{t('confirm')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
