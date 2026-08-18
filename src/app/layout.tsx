import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WHATS ✦ WhatsApp Sohbet Analiz & Yıllık Özet (Wrapped)',
  description: 'Arkadaş grupları için WhatsApp sohbet analizi, kişilik kartları ve Spotify Wrapped tarzı Yıl Özeti.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,600;1,9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (var i = 0; i < registrations.length; i++) {
                    registrations[i].unregister();
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-[#07090C] text-white min-h-screen antialiased selection:bg-[#38BDF8]/30 selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
