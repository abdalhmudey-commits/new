'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useHabits } from '@/context/habit-context';
import { useLanguage } from '@/context/language-context';
import { useRecorder } from '@/hooks/use-recorder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Square, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(1, 'Habit name is required'),
  description: z.string(),
  reminderMessage: z.string(),
  frequency: z.coerce.number().min(1, 'Frequency must be at least 1'),
  timeUnit: z.enum(['minutes', 'hours', 'days']),
  reminderType: z.enum(['text', 'audio']),
});

type FormData = z.infer<typeof formSchema>;

export function AddHabitForm() {
  const { addHabit } = useHabits();
  const { t } = useLanguage();
  const { startRecording, stopRecording, resetRecording, recordingState, audioURL } = useRecorder();
  const [audioDataUrl, setAudioDataUrl] = useState<string | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      reminderMessage: '',
      frequency: 1,
      timeUnit: 'minutes',
      reminderType: 'text',
    },
  });

  const reminderType = watch('reminderType');

  useEffect(() => {
    if (audioURL) {
      const reader = new FileReader();
      fetch(audioURL)
        .then(res => res.blob())
        .then(blob => {
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            setAudioDataUrl(reader.result as string);
          };
        });
    } else {
      setAudioDataUrl(undefined);
    }
  }, [audioURL]);

  const onSubmit = (data: FormData) => {
    if (data.reminderType === 'audio' && !audioDataUrl) {
      alert('Please record an audio reminder.');
      return;
    }
    
    addHabit({
      ...data,
      audioSrc: data.reminderType === 'audio' ? audioDataUrl : undefined,
    });
    reset();
    resetRecording();
  };

  if (!isClient) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('add_habit_title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('habit_name_label')}</Label>
            <Input id="name" {...register('name')} placeholder={t('habit_name_placeholder')} />
            {errors.name && <p className="text-sm font-medium text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('habit_desc_label')}</Label>
            <Textarea id="description" {...register('description')} placeholder={t('habit_desc_placeholder')} />
          </div>

          <div className="space-y-2">
            <Label>{t('reminder_type_label')}</Label>
            <Controller
              control={control}
              name="reminderType"
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="text" />
                    <Label htmlFor="text">{t('reminder_type_text')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="audio" id="audio" />
                    <Label htmlFor="audio">{t('reminder_type_audio')}</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          {reminderType === 'text' ? (
            <div className="space-y-2">
              <Label htmlFor="reminderMessage">{t('reminder_msg_label')}</Label>
              <Input id="reminderMessage" {...register('reminderMessage')} placeholder={t('reminder_msg_placeholder')} />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>{t('reminder_msg_label')} (Audio)</Label>
              <div className="flex items-center gap-4 p-2 rounded-lg border">
                {recordingState !== 'recording' && (
                  <Button type="button" size="icon" onClick={startRecording} disabled={recordingState !== 'idle'}>
                    <Mic />
                  </Button>
                )}
                {recordingState === 'recording' && (
                  <Button type="button" size="icon" variant="destructive" onClick={stopRecording}>
                    <Square />
                  </Button>
                )}
                <div className="flex-grow">
                  {recordingState === 'recording' && <p className="text-sm text-destructive">{t('recording_status')}</p>}
                  {recordingState === 'stopped' && audioURL && (
                    <div className="flex items-center gap-2">
                       <p className="text-sm text-primary">{t('audio_recorded_status')}</p>
                       <audio src={audioURL} controls className="h-8" />
                    </div>
                  )}
                  {recordingState === 'idle' && !audioURL && <p className="text-sm text-muted-foreground">Click mic to record</p>}
                </div>
                 {audioURL && (
                  <Button type="button" size="icon" variant="ghost" onClick={resetRecording}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}


          <div className="space-y-2">
            <Label>{t('frequency_label')}</Label>
            <div className="flex gap-2">
                <Input id="frequency" type="number" {...register('frequency')} className="w-1/2" />
                <Controller
                  control={control}
                  name="timeUnit"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-1/2">
                            <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="minutes">{t('time_unit_minutes')}</SelectItem>
                            <SelectItem value="hours">{t('time_unit_hours')}</SelectItem>
                            <SelectItem value="days">{t('time_unit_days')}</SelectItem>
                        </SelectContent>
                    </Select>
                  )}
                />
            </div>
            {errors.frequency && <p className="text-sm font-medium text-destructive">{errors.frequency.message}</p>}
          </div>

          <Button type="submit" className="w-full">{t('add_habit_button')}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
