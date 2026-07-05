"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import {
  users as seedUsers,
  paymentsByUser,
  paymentStatusMeta,
  isPaymentApplicable,
  PAYMENT_EXEMPT_LABEL,
  CURRENT_MONTH,
  type PaymentDisplayStatus,
} from "@/lib/mock-data";

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

// "2026-07" → "2026年7月"
function monthLabel(ym: string) {
  const [y, m] = ym.split("-");
  return `${y}年${Number(m)}月`;
}

export default function UserPaymentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const user = seedUsers.find((u) => u.id === id);
  if (!user) notFound();

  // 在籍以外は当月が支払い対象外。履歴の表示状況を計算する。
  const applicable = isPaymentApplicable(user);
  const history = paymentsByUser(id).map((p) => {
    const display: PaymentDisplayStatus =
      !applicable && p.month === CURRENT_MONTH ? "exempt" : p.status;
    return { ...p, display };
  });
  const paidCount = history.filter((p) => p.display === "paid").length;
  const unpaidCount = history.filter((p) => p.display === "unpaid").length;

  return (
    <>
      <PageHeader title={`${user.name} の支払履歴`} backHref={`/users/${id}`} />

      <div className="max-w-[640px] px-8 py-8 lg:px-12">
        {/* サマリー */}
        <div className="rise mb-5 flex flex-wrap gap-3">
          <Summary label="支払い済み" value={`${paidCount}ヶ月`} tone="accent" />
          <Summary label="未払い" value={`${unpaidCount}ヶ月`} tone="rose" />
        </div>

        <div className="rise overflow-clip rounded-xl border border-line bg-surface-raised">
          {history.length === 0 ? (
            <p className="px-4 py-10 text-center text-[13px] text-muted">
              支払い記録がありません。
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {history.map((p) => (
                <li key={p.month} className="flex items-center gap-4 px-5 py-3.5">
                  <span className="tabular w-[92px] shrink-0 text-[14px] font-medium text-ink">
                    {monthLabel(p.month)}
                  </span>
                  <span className="tabular text-[13px] text-muted">
                    {p.display === "exempt" ? "—" : yen(p.amount)}
                  </span>
                  <span className="flex-1" />
                  <PaymentPill status={p.display} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

function PaymentPill({ status }: { status: PaymentDisplayStatus }) {
  if (status === "exempt") {
    return (
      <span className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-paper px-3 py-1 text-[12.5px] font-semibold text-faint ring-1 ring-inset ring-line-strong">
        {PAYMENT_EXEMPT_LABEL}
      </span>
    );
  }
  const paid = status === "paid";
  return (
    <span
      className={[
        "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[12.5px] font-semibold",
        paid ? "bg-accent-soft text-accent-ink" : "bg-rose-soft text-rose",
      ].join(" ")}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${paid ? "bg-accent" : "bg-rose"}`} />
      {paymentStatusMeta[status].label}
    </span>
  );
}

function Summary({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "accent" | "rose";
}) {
  return (
    <div className="rounded-xl border border-line bg-surface-raised px-5 py-3">
      <span className="block text-[11.5px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </span>
      <span
        className={`tabular mt-0.5 block text-[18px] font-bold ${
          tone === "accent" ? "text-accent-ink" : "text-rose"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
