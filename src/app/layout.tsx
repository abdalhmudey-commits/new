import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/app-providers';
import { AppHeader } from '@/components/layout/app-header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { SpeedInsights } from "@vercel/speed-insights/next";

const APP_NAME = "Habit Hacker";
const APP_DESCRIPTION = "PWA to hack your habits, with Islamic and cultural content.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: APP_NAME,
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#A0D2EB",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", "min-h-screen bg-background")}>
        <AppProviders>
          <div className="relative flex min-h-screen w-full flex-col">
            <AppHeader />
            <main className="flex-1 pb-20 pt-16">
              {children}
            </main>
            <BottomNav />
          </div>
          <Toaster />
        </AppProviders>
        <SpeedInsights/>
      </body>
    </html>
  );
}
