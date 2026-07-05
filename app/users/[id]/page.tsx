"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import {
  teams,
  teamById,
  userStatusMeta,
  DEFAULT_USER_STATUS,
  paymentStatusMeta,
  currentPaymentDisplay,
  PAYMENT_EXEMPT_LABEL,
  CURRENT_MONTH,
  type User,
  type UserStatus,
} from "@/lib/mock-data";
import { useCohortStore, updateUser } from "@/lib/cohort-store";

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const store = useCohortStore();
  // 保存済みの状態はストアが基準（変更検知の基準）。
  const found = store.users.find((u) => u.id === id);
  if (!found) notFound();
  const baseUser: User = found;

  const [user, setUser] = useState<User>(baseUser);
  const [savedFlash, setSavedFlash] = useState(false);

  // ストア側のこのユーザーが変わったらドラフトを同期する
  // （localStorage 復元後・保存後など）
  const baseKey = JSON.stringify(baseUser);
  useEffect(() => {
    setUser(JSON.parse(baseKey) as User);
  }, [baseKey]);

  const dirty = baseKey !== JSON.stringify(user);

  function patch(next: Partial<User>) {
    setUser((prev) => ({ ...prev, ...next }));
  }

  function onChangeTeam(teamId: string) {
    // 未割り当て（空）を選んだら期も空に。チームを選んだら期はそのチームの所属期に合わせる。
    if (!teamId) {
      patch({ teamId: "", cohortId: "" });
      return;
    }
    patch({ teamId, cohortId: teamById(teamId).cohortId });
  }

  function save() {
    // ストアに反映（一覧など他ページにも共有・永続化される）
    updateUser(user.id, user);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }

  // チームごとの所属人数（編集中のこのユーザーの移動を反映）
  const teamCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const u of store.users) {
      const teamId = u.id === user.id ? user.teamId : u.teamId;
      map[teamId] = (map[teamId] ?? 0) + 1;
    }
    return map;
  }, [store.users, user.id, user.teamId]);

  // チーム選択肢の人数ラベル。移動で増減するチームだけ「変更前→変更後」を出す。
  function teamCountLabel(teamId: string): string {
    const now = teamCounts[teamId] ?? 0;
    if (baseUser.teamId === user.teamId) return `${now}人`;
    if (teamId === baseUser.teamId) return `${now + 1}→${now}人`; // 抜ける
    if (teamId === user.teamId) return `${now - 1}→${now}人`; // 加わる
    return `${now}人`;
  }

  return (
    <>
      <PageHeader title="ユーザー詳細" backHref="/users" />

      <div className="max-w-[640px] px-8 py-8 lg:px-12">
        <section className="rise">
          <div className="overflow-hidden rounded-2xl border border-line bg-surface-raised shadow-[0_1px_0_rgba(0,0,0,0.02),0_12px_30px_-24px_rgba(27,26,22,0.35)]">
            {/* フィールド */}
            <div className="space-y-6 px-7 py-7">
              <Field label="名前">
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  className="w-full rounded-xl border border-line-strong bg-surface px-4 py-2.5 text-[14px] text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
              </Field>

              <Field label="メールアドレス">
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => patch({ email: e.target.value })}
                  className="w-full rounded-xl border border-line-strong bg-surface px-4 py-2.5 text-[14px] text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
              </Field>

              <Field label="登録日">
                <p className="rounded-xl border border-line bg-paper px-4 py-2.5 text-[14px] text-muted">
                  {formatDate(user.joinedAt)}
                </p>
              </Field>

              <Field label="チーム">
                <SelectBox
                  value={user.teamId}
                  onChange={onChangeTeam}
                  options={[
                    { value: "", label: "未割り当て" },
                    ...teams.map((t) => ({
                      value: t.id,
                      label: `${t.name}（${teamCountLabel(t.id)}）`,
                    })),
                  ]}
                />
              </Field>

              <Field label="ステータス">
                <StatusSegment
                  value={user.status ?? DEFAULT_USER_STATUS}
                  onChange={(s) => patch({ status: s })}
                />
              </Field>

              <Field label="支払い状況">
                <PaymentStatusBadge user={user} />
              </Field>
            </div>

            {/* フッター */}
            <div className="flex items-center justify-between gap-4 border-t border-line bg-surface px-7 py-4">
              <p className="text-[12px] text-muted">
                {savedFlash ? (
                  <span className="inline-flex items-center gap-1.5 font-medium text-accent">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-4 w-4">
                      <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    変更を保存しました（モック）
                  </span>
                ) : dirty ? (
                  "未保存の変更があります"
                ) : (
                  "変更は自動では保存されません"
                )}
              </p>
              <button
                onClick={save}
                disabled={!dirty}
                className="rounded-xl bg-accent px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-faint"
              >
                変更を保存
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// "2026-04-01" → "2026年4月1日"
function formatDate(ymd: string): string {
  const [y, m, d] = ymd.split("-");
  if (!y || !m || !d) return ymd;
  return `${y}年${Number(m)}月${Number(d)}日`;
}

function PaymentStatusBadge({ user }: { user: User }) {
  const status = currentPaymentDisplay(user);
  const exempt = status === "exempt";
  const paid = status === "paid";
  return (
    <div className="flex items-center gap-3">
      {exempt ? (
        <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-paper px-3 py-1 text-[13px] font-semibold text-faint ring-1 ring-inset ring-line-strong">
          {PAYMENT_EXEMPT_LABEL}
        </span>
      ) : (
        <span
          className={[
            "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-semibold",
            paid ? "bg-accent-soft text-accent-ink" : "bg-rose-soft text-rose",
          ].join(" ")}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${paid ? "bg-accent" : "bg-rose"}`} />
          {paymentStatusMeta[status].label}
        </span>
      )}
      <span className="text-[12px] text-muted">
        {exempt ? "在籍中のみ支払い対象" : `（${CURRENT_MONTH} 分）`}
      </span>
      <Link
        href={`/users/${user.id}/payments`}
        className="ml-auto text-[13px] font-medium text-accent hover:underline"
      >
        支払履歴を見る →
      </Link>
    </div>
  );
}

function StatusSegment({
  value,
  onChange,
}: {
  value: UserStatus;
  onChange: (s: UserStatus) => void;
}) {
  const items = Object.entries(userStatusMeta) as [UserStatus, { label: string }][];
  return (
    <div className="inline-flex rounded-xl border border-line-strong bg-surface p-1">
      {items.map(([s, meta]) => {
        const active = s === value;
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            aria-pressed={active}
            className={[
              "rounded-lg px-4 py-1.5 text-[13.5px] font-semibold transition",
              active
                ? "bg-accent text-white"
                : "text-ink-2 hover:bg-paper",
            ].join(" ")}
          >
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">
        {label}
      </span>
      {children}
    </label>
  );
}

function SelectBox({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-line-strong bg-surface px-4 py-2.5 pr-9 text-[14px] font-medium text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
      >
        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
