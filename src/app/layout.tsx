import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { AppLayout } from '@/components/AppLayout';

export const metadata: Metadata = {
  title: "RentAvtoControl - O'zbekistondagi Arendatorlar va Haydovchilar Avto-Ijara Tizimi",
  description: "Mashinasini arendaga beradigan arendatorlar va haydovchilar uchun yagona boshqaruv tizimi: ikki tomonlama to'lov eslatmalari, shartnomalar, GPS monitoring va avtopark boshqaruvi.",
  keywords: "rentavtocontrol, avto arenda, mashina arendaga berish, ijara avto toshkent, arendatorlar, avto ijara nazorat, tracker arenda",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" data-theme="light">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <AppProvider>
          <AppLayout>{children}</AppLayout>
        </AppProvider>
      </body>
    </html>
  );
}
