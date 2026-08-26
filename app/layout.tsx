import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import StoreProvider from "@/app/StoreProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
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
              "font-sans"
          )}
      >
      <body className="h-full overflow-hidden flex flex-col">
      <StoreProvider>
        <TooltipProvider>
          {children}
          <ToastContainer />
        </TooltipProvider>
      </StoreProvider>
      </body>
      </html>
  );
}