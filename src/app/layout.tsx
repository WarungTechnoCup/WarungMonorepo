import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { BottomNavigation } from "@/components/bottom-navigation";
import { ServiceWorkerManager } from "@/components/service-worker-manager";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Warung Cek Harga",
    template: "%s | Warung Cek Harga",
  },
  description:
    "Intelijen pengadaan komunitas untuk membantu warung memahami harga wajar dan bertindak bersama.",
  applicationName: "Warung Cek Harga",
  icons: { icon: "/icon.svg" },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="id"
      className="h-full antialiased"
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-full flex-col pb-16 md:pb-0">
        <a className="skip-link" href="#konten-utama">
          Lewati ke konten
        </a>
        <SiteHeader />
        <main id="konten-utama" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <BottomNavigation />
        <ServiceWorkerManager />
      </body>
    </html>
  );
}
