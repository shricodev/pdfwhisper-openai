import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

import Navbar from "@/components/Navbar/Navbar";
import { Toaster } from "@/components/ui/Toaster";
import Providers from "@/components/Providers/Providers";

import ParticipationBanner from "@/components/ParticipationBanner/ParticipationBanner";
import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "PDFwhisper - OpenAI",
  description:
    "PDFwhisper allows you to have a conversation with your PDF docs. Finding info on your PDF files is now easier than ever. Most secure authentication measures using Passkeys.",
};

// This is a fix for the issue with the CustomEvent problem in Hanko.
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Just one extra day to be on the safer side. The result are announced on 5th Nov.
  const hackathonEndDate = new Date("2023-11-06");
  const currentDate = new Date();
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
          {currentDate.getTime() < hackathonEndDate.getTime() ? (
            <ParticipationBanner />
          ) : null}
          <Navbar />
          {children}
        </body>
      </Providers>
    </html>
  );
}
