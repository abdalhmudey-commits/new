'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/language-context';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';

interface Summary {
  id: string;
  title: string;
  content: string;
}

export default function SummariesPage() {
  const { language, t } = useLanguage();
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchSummaries = async () => {
      setLoading(true);
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        const response = await fetch(`${basePath}/data/summaries/${language.code}.json`);
         if (!response.ok) {
            const fallbackResponse = await fetch(`${basePath}/data/summaries/en.json`);
            const data = await fallbackResponse.json();
            setSummaries(data);
        } else {
            const data = await response.json();
            setSummaries(data);
        }
      } catch (error) {
        console.error('Failed to fetch summaries data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, [language.code, isClient]);

  if (!isClient) {
     return (
       <div className="container mx-auto max-w-3xl px-4 py-8">
        <Skeleton className="h-10 w-48 mx-auto mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      </div>
     )
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline text-center">{t('nav_summaries')}</h1>
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {summaries.map((summary) => (
            <AccordionItem key={summary.id} value={summary.id}>
              <AccordionTrigger className="text-lg font-semibold">{summary.title}</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed px-2">
                {summary.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
