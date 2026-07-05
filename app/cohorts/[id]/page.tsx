"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import {
  useCohortStore,
  addTeam as addTeamInStore,
  deleteTeam as deleteTeamInStore,
} from "@/lib/cohort-store";

export default function CohortTeamsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const store = useCohortStore();
  const cohort = store.cohorts.find((c) => c.id === id);
  const teams = store.teams.filter((t) => t.cohortId === id);

  // 直前に追加したチーム（登場アニメーションを付ける対象）
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // チームごとの受講生数（ストア基準）。新設チームは 0 名。
  const memberCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const u of store.users) map[u.teamId] = (map[u.teamId] ?? 0) + 1;
    return map;
  }, [store.users]);

  function addTeam() {
    const created = addTeamInStore(id);
    setJustAddedId(created.id);
  }

  function deleteTeam(teamId: string) {
    const target = teams.find((t) => t.id === teamId);
    if (!target) return;
    deleteTeamInStore(teamId);
  }

  // 期が見つからないとき（不正な ID / 未復元）は 404 相当の案内を出す
  if (!cohort) {
    return (
      <>
        <PageHeader title="期が見つかりません" backHref="/cohorts" />
        <div className="max-w-[720px] px-8 py-8 lg:px-12">
          <p className="rise text-[13.5px] text-muted">
            指定された期は存在しません。
            <Link href="/cohorts" className="ml-1 font-medium text-accent hover:underline">
              期の一覧
            </Link>
            に戻ってください。
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={`${cohort.name} のチーム`}
        description="この期に所属するチームの一覧です。チームの追加・削除ができます。"
        backHref="/cohorts"
      />

      <div className="max-w-[720px] px-8 py-8 lg:px-12">
        {/* リスト右上のアクション */}
        <div className="rise mb-3 flex justify-end">
          <button
            type="button"
            onClick={addTeam}
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-accent-hover"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-4 w-4">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            チームを追加
          </button>
        </div>

        <div className="rise overflow-clip rounded-xl border border-line bg-surface-raised">
          {teams.length === 0 ? (
            <p className="px-4 py-10 text-center text-[13px] text-muted">
              この期にはまだチームがありません。右上の「チームを追加」から追加できます。
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {teams.map((t) => {
                const members = memberCounts[t.id] ?? 0;
                const empty = members === 0;
                return (
                  <li key={t.id} className={t.id === justAddedId ? "row-enter" : undefined}>
                    <Link
                      href={`/cohorts/${id}/teams/${t.id}`}
                      className="group flex items-center gap-3 px-4 py-3.5 transition hover:bg-paper/70"
                    >
                      <span className="font-display text-[16px] font-bold text-ink">{t.name}</span>
                      <span className="flex-1" />
                      <span className="tabular text-[13px] text-muted">{members} 名</span>
                      {empty && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteTeam(t.id);
                          }}
                          aria-label={`${t.name}を削除`}
                          title={`${t.name}を削除`}
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-faint transition hover:bg-rose-soft hover:text-rose"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                            <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      )}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0 text-faint transition group-hover:text-accent">
                        <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p className="mt-8 text-[12.5px] text-muted">
          受講生が所属しているチームは削除できません。
          <Link href="/users" className="ml-1 font-medium text-accent hover:underline">
            ユーザー管理
          </Link>
          で所属を変更してから削除してください。
        </p>
      </div>
    </>
  );
}
