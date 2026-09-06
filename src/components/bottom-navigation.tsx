"use client";

import {
  ClockCounterClockwise,
  House,
  MagnifyingGlass,
  NotePencil,
  UsersThree,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Beranda", icon: House },
  { href: "/cek-harga", label: "Cek harga", icon: MagnifyingGlass },
  { href: "/lapor-harga", label: "Lapor", icon: NotePencil },
  { href: "/kulakan-bareng", label: "Kulakan", icon: UsersThree },
  { href: "/aktivitas", label: "Aktivitas", icon: ClockCounterClockwise },
];

export function isActiveRoute(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi utama seluler"
      className="border-ink/10 bg-paper/95 fixed inset-x-0 bottom-0 z-50 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <ul className="grid grid-cols-5">
        {navigation.map((item) => {
          const active = isActiveRoute(pathname, item.href);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 text-[0.6875rem] leading-tight font-semibold ${
                  active ? "text-accent-strong" : "text-ink-muted"
                }`}
                href={item.href}
              >
                <Icon
                  aria-hidden="true"
                  size={22}
                  weight={active ? "fill" : "regular"}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
