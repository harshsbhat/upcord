import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster"
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster as Sonner } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "Upcord",
  description: "Open-source support platform",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      
      <body>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <TRPCReactProvider>{children}</TRPCReactProvider>
        </ThemeProvider>
        <Toaster />
        <Sonner />
      </body>
    </html>
  );
}
