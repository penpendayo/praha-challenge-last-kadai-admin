"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import {
  cohorts,
  userStatusMeta,
  DEFAULT_USER_STATUS,
  paymentStatusMeta,
  currentPaymentDisplay,
  PAYMENT_EXEMPT_LABEL,
  type User,
  type UserStatus,
} from "@/lib/mock-data";
import { useCohortStore } from "@/lib/cohort-store";

export default function UsersPage() {
  const store = useCohortStore();
  // 名前・メールでの検索
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return store.users;
    return store.users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [store.users, query]);

  return (
    <>
      <PageHeader
        title="ユーザー管理"
        description="受講生を選ぶと、その受講生の詳細ページで期・メールアドレス・チームを確認・変更できます。"
      />

      <div className="mx-auto max-w-[720px] px-8 py-8 lg:px-12">
        {/* 名前・メールで検索 */}
        <div className="rise relative mb-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3-3" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="名前・メールで検索"
            className="w-full rounded-xl border border-line-strong bg-surface py-2.5 pl-10 pr-9 text-[13.5px] text-ink outline-none transition placeholder:text-faint focus:border-accent focus:ring-4 focus:ring-accent/10"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="検索条件をクリア"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-faint transition hover:text-ink"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        <div className="rise overflow-clip rounded-xl border border-line bg-surface-raised">
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center text-[13px] text-muted">
              該当するユーザーがいません
            </div>
          ) : (
            [
              // どのチームにも配属されていない受講生（一番上に表示）
              {
                key: "unassigned",
                label: "チーム未割り当て",
                list: filtered.filter((u) => !u.teamId),
              },
              ...cohorts.map((c) => ({
                key: c.id,
                label: c.name,
                list: filtered.filter((u) => u.cohortId === c.id),
              })),
            ]
              .filter((g) => g.list.length > 0)
              .map(({ key, label, list }) => (
                <div key={key}>
                  <div className="sticky top-(--page-header-h,107px) z-5 border-b border-line bg-paper/85 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted backdrop-blur-sm">
                    {label}
                  </div>
                  <ul className="divide-y divide-line">
                    {list.map((u) => (
                      <li key={u.id}>
                        <Link
                          href={`/users/${u.id}`}
                          className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-paper/70"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[14px] font-medium text-ink">
                              {u.name}
                            </span>
                            <span className="block truncate text-[12px] text-muted">
                              {u.email}
                            </span>
                          </span>
                          <StatusBadge status={u.status ?? DEFAULT_USER_STATUS} />
                          <PaymentBadge user={u} />
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0 text-faint">
                            <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
          )}
        </div>
      </div>
    </>
  );
}

// 在籍ステータスのバッジ（状態ごとに色分け）
const statusBadgeClass: Record<UserStatus, string> = {
  trial: "bg-rose-soft text-rose",
  enrolled: "bg-accent-soft text-accent-ink",
  paused: "bg-amber-soft text-amber",
  graduated: "bg-sky-soft text-sky",
  withdrawn: "bg-paper text-faint ring-1 ring-inset ring-line-strong",
};

function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <span
      className={`hidden shrink-0 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[12px] font-semibold sm:inline-block ${statusBadgeClass[status]}`}
    >
      {userStatusMeta[status].label}
    </span>
  );
}

function PaymentBadge({ user }: { user: User }) {
  const status = currentPaymentDisplay(user);
  // 在籍以外は支払い対象外
  if (status === "exempt") {
    return (
      <span className="hidden shrink-0 whitespace-nowrap rounded-full bg-paper px-2.5 py-0.5 text-[12px] font-semibold text-faint ring-1 ring-inset ring-line-strong sm:inline-block">
        {PAYMENT_EXEMPT_LABEL}
      </span>
    );
  }
  const paid = status === "paid";
  return (
    <span
      className={`hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[12px] font-semibold sm:inline-flex ${
        paid ? "bg-accent-soft text-accent-ink" : "bg-rose-soft text-rose"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${paid ? "bg-accent" : "bg-rose"}`} />
      {paymentStatusMeta[status].label}
    </span>
  );
}
