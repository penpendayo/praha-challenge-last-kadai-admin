"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { usersByCohort } from "@/lib/mock-data";
import {
  useCohortStore,
  startCohort,
  deleteCohort as deleteCohortInStore,
} from "@/lib/cohort-store";

export default function CohortsPage() {
  const { cohorts, teams, currentCohortId: current } = useCohortStore();

  // 直前に追加した期（登場アニメーションを付ける対象）
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // 期ごとの規模（チーム数・受講生数）。新しい期は 0 になる。
  const stats = useMemo(() => {
    const map: Record<string, { teams: number; users: number }> = {};
    for (const c of cohorts) {
      map[c.id] = {
        teams: teams.filter((t) => t.cohortId === c.id).length,
        users: usersByCohort(c.id).length,
      };
    }
    return map;
  }, [cohorts, teams]);

  function startNewCohort() {
    const created = startCohort();
    setJustAddedId(created.id);
  }

  function deleteCohort(id: string) {
    const target = cohorts.find((c) => c.id === id);
    if (!target) return;
    deleteCohortInStore(id);
  }

  return (
    <>
      <PageHeader
        title="期"
        description="期をクリックすると、その期のチーム構成を確認・編集できます。新しい期を開始することもできます。"
      />

      <div className="max-w-[720px] px-8 py-8 lg:px-12">
        {/* リスト右上のアクション */}
        <div className="rise mb-3 flex justify-end">
          <button
            type="button"
            onClick={startNewCohort}
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-accent-hover"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-4 w-4">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            新しい期をはじめる
          </button>
        </div>

        {/* 期の一覧（リスト）*/}
        <div className="rise overflow-clip rounded-xl border border-line bg-surface-raised">
          <ul className="divide-y divide-line">
            {cohorts.map((c) => {
              const on = current === c.id;
              const empty = stats[c.id].users === 0;
              return (
                <li key={c.id} className={c.id === justAddedId ? "row-enter" : undefined}>
                  <Link
                    href={`/cohorts/${c.id}`}
                    className="group flex items-center gap-3 px-4 py-3.5 transition hover:bg-paper/70"
                  >
                    <span className="font-display text-[16px] font-bold text-ink">{c.name}</span>
                    {on && (
                      <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-semibold text-accent">
                        現在の期
                      </span>
                    )}
                    <span className="flex-1" />
                    <span className="tabular text-[13px] text-muted">
                      {stats[c.id].teams} チーム ・ {stats[c.id].users} 名
                    </span>
                    {empty && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteCohort(c.id);
                        }}
                        aria-label={`${c.name}を削除`}
                        title={`${c.name}を削除`}
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
        </div>
      </div>
    </>
  );
}
