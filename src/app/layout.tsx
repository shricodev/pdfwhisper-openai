import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { cn, createMetadata } from "@/lib/utils";

import Navbar from "@/components/Navbar/Navbar";
import { Toaster } from "@/components/ui/Toaster";
import Providers from "@/components/Providers/Providers";
import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = createMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <Providers>
        <body
          className={cn(
            "min-h-screen bg-gradient-to-r from-rose-50 to-teal-50 antialiased",
            poppins.className,
          )}
        >
          <Toaster />
          <Navbar />
          {children}
        </body>
      </Providers>
    </html>
  );
}
