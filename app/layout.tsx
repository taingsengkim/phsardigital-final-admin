import type { Metadata } from "next";
import { Inter, Hanuman } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import StoreProvider from "@/app/StoreProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const hanuman = Hanuman({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["khmer"],
  variable: "--font-khmer",
});

export const metadata: Metadata = {
  title: "Phsar Digital Admin",
  description: "Marketplace administration dashboard",
  icons: {
    icon: "/Phsar Digital purple-light.png",
    shortcut: "/Phsar Digital purple-light.png",
    apple: "/Phsar Digital purple-light.png",
  },
};

import { ToastContainer } from "@/components/ui/toast-popup";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
          lang="en"
          className={cn(
              "h-full",
              "antialiased",
              inter.variable,
              hanuman.variable,
              "font-sans"
          )}
      >
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Hanuman:wght@100..900&display=swap" rel="stylesheet" />
        </head>
      <body className="h-full overflow-hidden flex flex-col font-sans">
      <StoreProvider>
        <LanguageProvider>
          <TooltipProvider>
            {children}
            <ToastContainer />
          </TooltipProvider>
        </LanguageProvider>
      </StoreProvider>
      </body>
      </html>
  );
}