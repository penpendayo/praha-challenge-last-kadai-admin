"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  {
    href: "/cohorts",
    label: "期",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" stroke="currentColor" className="h-[18px] w-[18px]">
        <rect x="4" y="5.5" width="16" height="15" rx="1.8" />
        <path d="M4 9.5h16M8 3.5v4M16 3.5v4" strokeLinecap="round" />
        <circle cx="12" cy="15" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "/users",
    label: "ユーザー",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" stroke="currentColor" className="h-[18px] w-[18px]">
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 19.5c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/challenge-access",
    label: "課題開放",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" stroke="currentColor" className="h-[18px] w-[18px]">
        <rect x="4" y="10.5" width="16" height="9.5" rx="1.6" />
        <path d="M7.5 10.5V7.5a4.5 4.5 0 0 1 9 0" strokeLinecap="round" />
        <circle cx="12" cy="15" r="1.3" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "/progress",
    label: "進捗一覧",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" stroke="currentColor" className="h-[18px] w-[18px]">
        <path d="M4 20V4" strokeLinecap="round" />
        <path d="M4 20h16" strokeLinecap="round" />
        <rect x="7.5" y="12" width="3" height="5" rx="0.6" />
        <rect x="12.5" y="8" width="3" height="9" rx="0.6" />
        <rect x="17.5" y="5" width="3" height="12" rx="0.6" fill="currentColor" fillOpacity="0.25" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  function handleLogout() {
    // モック：本来はセッションを破棄してログイン画面へ遷移する
    window.location.href = "/login";
  }

  return (
    <aside className="sticky top-0 flex h-screen w-[264px] shrink-0 flex-col border-r border-line bg-nav-bg text-nav-text">
      {/* ブランド */}
      <div className="px-6 pt-7 pb-6">
        <Link href="/users" className="group flex items-center gap-3">
          <span className="font-display text-[16px] font-bold tracking-wide text-nav-active">
            PrAha Challenge Admin
          </span>
        </Link>
      </div>

      <div className="mx-6 h-px bg-nav-line" />

      {/* ナビ */}
      <nav className="flex-1 px-3 py-5">
        <ul className="space-y-1">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "group relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 transition-colors",
                    active
                      ? "bg-accent-soft text-accent font-semibold"
                      : "text-nav-text hover:bg-paper hover:text-nav-active",
                  ].join(" ")}
                >
                  <span className={active ? "text-accent" : "text-faint group-hover:text-ink-2"}>
                    {item.icon}
                  </span>
                  <span className="text-[14px] font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* フッター（ログイン中の管理者・モック）*/}
      <div className="mx-6 h-px bg-nav-line" />
      <div className="flex items-center justify-between gap-2 px-6 py-5">
        <div className="min-w-0">
          <span className="block truncate text-[13px] font-medium text-nav-active">
            管理者アカウント
          </span>
          <span className="block truncate text-[11px] text-nav-muted">
            admin@praha-inc.com
          </span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="ログアウト"
          title="ログアウト"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-nav-muted transition hover:bg-paper hover:text-nav-active"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
            <path d="M15 12H4m0 0 3.5-3.5M4 12l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 4h7a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
