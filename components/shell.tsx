"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { RouteSpinner } from "@/components/route-spinner";

// サイドバーを出さないページ（ログインなど）
const BARE_ROUTES = ["/login"];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  if (bare) return <main className="paper-grain min-h-screen">{children}</main>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="paper-grain relative min-w-0 flex-1">
        <RouteSpinner />
        {children}
      </main>
    </div>
  );
}
