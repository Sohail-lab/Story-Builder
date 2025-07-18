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

export const metadata: Metadata = {
  title: "Fantasy Story Builder - Create Your Adventure",
  description: "Build your personalized fantasy story through an interactive quiz. Answer questions about your character and world to generate a unique AI-powered narrative.",
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
      </head>
      <body
        className={`${inter.variable} ${cinzel.variable} font-sans antialiased bg-fantasy-midnight-dark text-fantasy-parchment min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
