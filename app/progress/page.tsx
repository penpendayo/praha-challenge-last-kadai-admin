"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import {
  cohorts,
  cohortDefaultVersion,
  curriculums,
  genresByVersion,
  teamById,
  usersByCohort,
  challengesByGenre,
  initialProgress,
  initialGenreAccessV,
  statusMeta,
  type ProgressStatus,
} from "@/lib/mock-data";

function StatusIndicator({ status }: { status: ProgressStatus }) {
  // 完了・未着手・未解放をアイコンで表す。
  const base = "h-[22px] w-[22px] rounded-[7px]";
  switch (status) {
    case "done":
      return (
        <span className={`${base} grid place-items-center bg-accent`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" className="h-3 w-3">
            <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      );
    case "todo":
      // 未着手：ダッシュ（横線）
      return (
        <span className={`${base} grid place-items-center ring-1 ring-inset ring-line-strong`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-3 w-3 text-faint">
            <path d="M6 12h12" strokeLinecap="round" />
          </svg>
        </span>
      );
    case "locked":
      // 未解放：グレーの下地に鍵アイコン
      return (
        <span className={`${base} grid place-items-center bg-paper ring-1 ring-inset ring-line-strong`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-2.5 w-2.5 text-faint">
            <rect x="5" y="11" width="14" height="9" rx="1.6" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
          </svg>
        </span>
      );
    default:
      return <span className={`${base} ring-1 ring-inset ring-line-strong`} />;
  }
}

export default function ProgressPage() {
  const [cohortId, setCohortId] = useState<string>(cohorts[cohorts.length - 1].id);
  const progress = initialProgress;

  const cohortUsers = useMemo(() => usersByCohort(cohortId), [cohortId]);

  // その期のカリキュラム版でジャンル構成が決まる（課題開放と同じモデル）
  const version = cohortDefaultVersion[cohortId] ?? curriculums[0].id;
  const versionGenres = useMemo(() => genresByVersion(version), [version]);

  const isLocked = (teamId: string, genreId: string) =>
    !initialGenreAccessV[`${teamId}:${version}:${genreId}`];

  // 連続する同一チームをまとめる（ヘッダーの結合用）
  const teamGroups = useMemo(() => {
    const groups: { teamId: string; count: number }[] = [];
    for (const user of cohortUsers) {
      const last = groups[groups.length - 1];
      if (last && last.teamId === user.teamId) last.count += 1;
      else groups.push({ teamId: user.teamId, count: 1 });
    }
    return groups;
  }, [cohortUsers]);

  const cohortSelect = (
    <div className="relative shrink-0">
      <select
        value={cohortId}
        onChange={(e) => setCohortId(e.target.value)}
        className="tabular appearance-none rounded-xl border border-line-strong bg-surface py-2.5 pl-4 pr-10 text-[14px] font-semibold text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
      >
        {cohorts.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted">
        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  return (
    <>
      <PageHeader
        title="進捗一覧"
        description="期を選ぶと、その期の受講生が課題ごとにどこまで進んでいるかを一覧できます。"
      />

      <div className="max-w-[1180px] px-8 py-8 lg:px-12">
        {/* 凡例＋期セレクター（表の右上）*/}
        <div className="rise mb-5 flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {(Object.keys(statusMeta) as ProgressStatus[]).map((s) => (
              <span key={s} className="inline-flex items-center gap-2 text-[12.5px] text-muted">
                <span className="grid h-[22px] w-6 place-items-center">
                  <StatusIndicator status={s} />
                </span>
                {statusMeta[s].label}
              </span>
            ))}
          </div>
          {cohortSelect}
        </div>

        {cohortUsers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line-strong bg-surface-raised px-6 py-16 text-center text-[13.5px] text-muted">
            この期に所属するユーザーはいません
          </div>
        ) : (
          <div className="rise thin-scroll overflow-x-auto rounded-2xl border border-line bg-surface-raised shadow-[0_12px_30px_-24px_rgba(27,26,22,0.35)]">
            <table className="border-collapse">
              <thead>
                {/* チーム行（メンバー列をまたいで結合）*/}
                <tr>
                  <th
                    rowSpan={2}
                    className="sticky left-0 z-20 min-w-[240px] border-b border-line bg-surface px-5 py-3 text-left align-bottom"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
                      課題 \ チーム・受講生
                    </span>
                  </th>
                  {teamGroups.map((g, gi) => (
                    <th
                      key={g.teamId}
                      colSpan={g.count}
                      className={`bg-surface px-3 pt-3 pb-2 align-bottom ${
                        gi > 0 ? "border-l border-line-strong" : "border-l border-line"
                      }`}
                    >
                      <div className="tabular text-center text-[12px] font-semibold text-ink-2">
                        {teamById(g.teamId).name}
                      </div>
                      <div className="mt-1.5 h-px bg-line" />
                    </th>
                  ))}
                </tr>
                {/* 受講生行 */}
                <tr>
                  {cohortUsers.map((user, i) => {
                    const teamStart =
                      i > 0 && cohortUsers[i - 1].teamId !== user.teamId;
                    return (
                      <th
                        key={user.id}
                        className={`w-[74px] border-b bg-surface px-1.5 py-3 align-bottom ${
                          teamStart ? "border-l border-line-strong" : "border-l border-line"
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <span className="max-w-[64px] truncate text-[11px] font-medium text-ink">
                            {user.name.split(" ")[0]}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {versionGenres.map((genre) => {
                  const genreChallenges = challengesByGenre(genre.id);
                  if (genreChallenges.length === 0) return null;
                  return (
                    <Fragment key={genre.id}>
                      {/* ジャンル見出し（バー）*/}
                      <tr>
                        <td className="sticky left-0 z-10 border-t border-line bg-paper px-5 py-2">
                          <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink-2">
                            {genre.name}
                          </span>
                        </td>
                        {cohortUsers.map((user, i) => {
                          const teamStart =
                            i > 0 && cohortUsers[i - 1].teamId !== user.teamId;
                          return (
                            <td
                              key={user.id}
                              className={`border-t border-line bg-paper px-1.5 py-2 ${
                                teamStart ? "border-l border-line-strong" : "border-l border-line"
                              }`}
                            />
                          );
                        })}
                      </tr>
                      {genreChallenges.map((ch, rowIdx) => (
                        <tr key={ch.id} className="group">
                          <th
                            scope="row"
                            className="sticky left-0 z-10 border-t border-line bg-surface-raised px-5 py-2.5 text-left group-hover:bg-paper/60"
                          >
                            <span className="block max-w-[220px] truncate text-[13px] font-medium text-ink">
                              {ch.title}
                            </span>
                          </th>
                          {cohortUsers.map((user, i) => {
                            const teamStart =
                              i > 0 && cohortUsers[i - 1].teamId !== user.teamId;
                            const borderClass = teamStart
                              ? "border-l border-line-strong"
                              : "border-l border-line";

                            // 未解放ジャンル：教材行を縦に結合し、開放ボタンを 1 つだけ表示
                            if (isLocked(user.teamId, genre.id)) {
                              if (rowIdx !== 0) return null;
                              return (
                                <td
                                  key={user.id}
                                  rowSpan={genreChallenges.length}
                                  className={`border-t border-line bg-paper/40 px-1.5 align-middle ${borderClass}`}
                                >
                                  <Link
                                    href={`/challenge-access/${user.teamId}`}
                                    title={`${teamById(user.teamId).name} ・ ${genre.name} ・ 未解放（クリックで課題開放設定へ）`}
                                    className="group/lock mx-auto flex w-full flex-col items-center gap-1.5 rounded-lg py-3 transition hover:bg-accent-soft/50"
                                  >
                                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-surface ring-1 ring-inset ring-line-strong transition group-hover/lock:bg-accent group-hover/lock:ring-accent">
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-faint transition group-hover/lock:text-white">
                                        <rect x="5" y="11" width="14" height="9" rx="1.6" />
                                        <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
                                      </svg>
                                    </span>
                                    <span className="text-[11px] font-semibold text-muted transition group-hover/lock:text-accent">
                                      開放
                                    </span>
                                  </Link>
                                </td>
                              );
                            }

                            const status: ProgressStatus =
                              progress[`${user.id}:${ch.id}`] ?? "todo";
                            const meta = statusMeta[status];
                            return (
                              <td
                                key={user.id}
                                className={`border-t border-line px-1.5 py-2.5 group-hover:bg-paper/30 ${borderClass}`}
                              >
                                <span
                                  title={`${user.name} ・ ${ch.title} ・ ${meta.label}`}
                                  className="mx-auto flex h-6 w-6 items-center justify-center"
                                >
                                  <StatusIndicator status={status} />
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

