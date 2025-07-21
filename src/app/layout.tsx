import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: "Fantasy Story Builder - Create Your Adventure",
  description: "Build your personalized fantasy story through an interactive quiz. Answer questions about your character and world to generate a unique AI-powered narrative.",
  openGraph: {
    title: "Fantasy Story Builder - Create Your Adventure",
    description: "Build your personalized fantasy story through an interactive quiz. Answer questions about your character and world to generate a unique AI-powered narrative.",
    url: siteUrl,
    siteName: "Fantasy Story Builder",
    images: [
      {
        url: "/globe.svg", // Example image in public/
        width: 1200,
        height: 630,
        alt: "Fantasy Story Builder Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fantasy Story Builder - Create Your Adventure",
    description: "Build your personalized fantasy story through an interactive quiz. Answer questions about your character and world to generate a unique AI-powered narrative.",
    images: ["/globe.svg"],
    creator: "@yourtwitterhandle", // Replace with your Twitter handle
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1a1625" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Fantasy Story Builder',
              url: siteUrl,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${siteUrl}/?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Fantasy Story Builder',
                url: siteUrl,
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${cinzel.variable} font-sans antialiased bg-fantasy-midnight-dark text-fantasy-parchment min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}