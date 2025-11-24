'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/language-context';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface Dhikr {
  id: string;
  text: string;
}

interface AdhkarData {
  morning: Dhikr[];
  evening: Dhikr[];
}

export default function AdhkarPage() {
  const { language, t } = useLanguage();
  const [adhkar, setAdhkar] = useState<AdhkarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchAdhkar = async () => {
      setLoading(true);
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        const response = await fetch(`${basePath}/data/adhkar/${language.code}.json`);
        if (!response.ok) {
            // fallback to english
            const fallbackResponse = await fetch(`${basePath}/data/adhkar/en.json`);
            const data = await fallbackResponse.json();
            setAdhkar(data);
        } else {
            const data = await response.json();
            setAdhkar(data);
        }
      } catch (error) {
        console.error('Failed to fetch adhkar data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdhkar();
  }, [language.code, isClient]);

  if (!isClient) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Skeleton className="h-10 w-48 mx-auto mb-6" />
        <Skeleton className="h-12 w-full mb-4" />
        <Card>
            <CardContent className="p-0">
                <div className="p-6 space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
            </CardContent>
          </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline text-center">{t('nav_adhkar')}</h1>
      <Tabs defaultValue="morning" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="morning">{t('adhkar_morning')}</TabsTrigger>
          <TabsTrigger value="evening">{t('adhkar_evening')}</TabsTrigger>
        </TabsList>
        <TabsContent value="morning">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-15rem)]">
                <div className="p-6 space-y-4">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
                  ) : (
                    adhkar?.morning.map((dhikr, index) => (
                      <div key={dhikr.id} className="text-lg leading-relaxed p-4 border-b">
                         <span className="font-bold text-primary">{index + 1}. </span>
                         {dhikr.text}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="evening">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-15rem)]">
                <div className="p-6 space-y-4">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
                  ) : (
                    adhkar?.evening.map((dhikr, index) => (
                      <div key={dhikr.id} className="text-lg leading-relaxed p-4 border-b">
                        <span className="font-bold text-primary">{index + 1}. </span>
                        {dhikr.text}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
