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
};

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
      <body className="min-h-full flex flex-col">
      <StoreProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </StoreProvider>
      </body>
      </html>
  );
}