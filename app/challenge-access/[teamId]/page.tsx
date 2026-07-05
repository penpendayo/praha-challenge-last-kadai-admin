"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import {
  cohortDefaultVersion,
  curriculums,
  teams,
  teamById,
  genresByVersion,
  initialGenreAccessV,
} from "@/lib/mock-data";

export default function TeamAccessPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = use(params);
  const exists = teams.some((t) => t.id === teamId);
  if (!exists) notFound();
  const team = teamById(teamId);

  const [access, setAccess] = useState<Record<string, boolean>>(initialGenreAccessV);
  // 開放を編集する対象の版（既定はその期のデフォルト版）
  const [version, setVersion] = useState(cohortDefaultVersion[team.cohortId] ?? curriculums[0].id);

  const genres = genresByVersion(version);

  function toggleGenre(genreId: string) {
    const k = `${teamId}:${version}:${genreId}`;
    setAccess((prev) => ({ ...prev, [k]: !prev[k] }));
  }

  return (
    <>
      <PageHeader title="課題開放" backHref="/challenge-access" />

      <div className="max-w-[720px] px-8 py-8 lg:px-12">
        <section className="rise overflow-hidden rounded-2xl border border-line bg-surface-raised shadow-[0_12px_30px_-24px_rgba(27,26,22,0.35)]">
          {/* ヘッダ */}
          <div className="border-b border-line bg-surface px-7 py-6">
            <h2 className="tabular font-display text-[22px] font-bold text-ink">{team.name}</h2>
          </div>

          {/* 開放するジャンル（版を選んで編集）*/}
          <div className="px-7 py-7">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-[13px] font-semibold text-ink-2">開放するジャンル</h3>
                <p className="mt-1 text-[11.5px] text-faint">
                  開放したジャンルだけが受講生に表示されます（未開放は非表示）。
                </p>
              </div>
              <label className="flex items-center gap-2">
                <span className="text-[11.5px] font-medium text-muted">対象の版</span>
                <div className="relative inline-block">
                  <select
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="tabular appearance-none rounded-lg border border-line-strong bg-surface py-1.5 pl-3 pr-8 text-[13px] font-semibold text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                  >
                    {curriculums.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted">
                    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </label>
            </div>

            <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line">
              {genres.map((g) => {
                const on = !!access[`${teamId}:${version}:${g.id}`];
                return (
                  <li
                    key={g.id}
                    className="flex items-center justify-between gap-3 bg-surface-raised px-4 py-3"
                  >
                    <span className="text-[14px] font-medium text-ink">{g.name}</span>
                    <AccessToggle on={on} onClick={() => toggleGenre(g.id)} />
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}

function AccessToggle({ on, onClick }: { on: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={[
        "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors hover:opacity-90",
        on ? "bg-accent" : "bg-line-strong",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-5 w-5 place-items-center rounded-full bg-white shadow-sm transition-transform duration-200",
          on ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      >
        {on ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3 w-3 text-accent">
            <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <span className="h-1 w-1.5 rounded-full bg-faint" />
        )}
      </span>
    </button>
  );
}
