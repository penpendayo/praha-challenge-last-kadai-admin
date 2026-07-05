"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  cohorts,
  cohortDefaultVersion,
  curriculums,
  teamsByCohort,
  genresByVersion,
  initialGenreAccessV,
} from "@/lib/mock-data";

export default function ChallengeAccessPage() {
  // 期ごとのデフォルト版（この場で変更できる）
  const [cohortVersions, setCohortVersions] =
    useState<Record<string, string>>(cohortDefaultVersion);

  function setVersion(cohortId: string, version: string) {
    setCohortVersions((prev) => ({ ...prev, [cohortId]: version }));
  }

  // 一覧のサマリは初期データ（モック）から算出
  function openedSummary(teamId: string, cohortId: string) {
    const version = cohortVersions[cohortId];
    const genres = genresByVersion(version);
    const opened = genres.filter(
      (g) => initialGenreAccessV[`${teamId}:${version}:${g.id}`],
    ).length;
    return { opened, total: genres.length };
  }

  return (
    <>
      <PageHeader
        title="課題開放"
        description="チームごとに、開放するジャンルを設定します。"
      />

      <div className="mx-auto max-w-[1180px] px-8 py-8 lg:px-12">
        <div className="rise space-y-8">
          {cohorts.map((c) => {
            const list = teamsByCohort(c.id);
            if (list.length === 0) return null;
            return (
              <section key={c.id}>
                <div className="mb-3 flex items-center gap-2.5">
                  <h2 className="text-[12px] font-semibold uppercase tracking-widest text-muted">
                    {c.name}
                  </h2>
                  <label className="flex items-center gap-1.5">
                    <span className="text-[11px] font-medium text-faint">カリキュラム版</span>
                    <div className="relative inline-block">
                      <select
                        value={cohortVersions[c.id]}
                        onChange={(e) => setVersion(c.id, e.target.value)}
                        className="tabular appearance-none rounded-md border border-line-strong bg-surface py-1 pl-2.5 pr-7 text-[12px] font-semibold text-accent-ink outline-none transition hover:border-accent focus:border-accent focus:ring-2 focus:ring-accent/10"
                      >
                        {curriculums.map((cu) => (
                          <option key={cu.id} value={cu.id}>
                            {cu.name}
                          </option>
                        ))}
                      </select>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted">
                        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((t) => {
                    const { opened, total } = openedSummary(t.id, c.id);
                    return (
                      <Link
                        key={t.id}
                        href={`/challenge-access/${t.id}`}
                        className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-raised px-5 py-4 text-left transition hover:border-accent hover:shadow-[0_8px_24px_-16px_rgba(0,0,0,0.35)]"
                      >
                        <div className="min-w-0">
                          <div className="tabular text-[16px] font-bold text-ink">{t.name}</div>
                          <div className="mt-1 text-[12px] text-muted">
                            開放 {opened}/{total} ジャンル
                          </div>
                        </div>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 shrink-0 text-faint transition group-hover:text-accent">
                          <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
