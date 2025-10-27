import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/providers/theme-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { OrderProvider } from '@/context/order-context';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: "Rue's Delectables",
  description: 'Handcrafted cakes, cupcakes, and treats for every occasion.',
  icons: {
    icon: 'https://i.imgur.com/iwxnVR1.png',
  },
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
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400..900&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('min-h-screen font-body antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <OrderProvider>
              <div className="relative flex min-h-dvh flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <div className="relative bg-background">
                  <Footer />
                </div>
              </div>
              <Toaster />
            </OrderProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
