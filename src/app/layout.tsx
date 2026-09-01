import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Warung Cek Harga",
    template: "%s | Warung Cek Harga",
  },
  description:
    "Fondasi pengadaan cerdas untuk membantu warung memahami harga wajar dan bertindak bersama.",
  applicationName: "Warung Cek Harga",
  icons: { icon: "/icon.svg" },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <a className="skip-link" href="#konten-utama">
          Lewati ke konten
        </a>
        <SiteHeader />
        <main id="konten-utama" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
