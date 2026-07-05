"use client";

import { use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import {
  useCohortStore,
  assignUserToTeam,
  unassignUser,
} from "@/lib/cohort-store";

export default function TeamMembersPage({
  params,
}: {
  params: Promise<{ id: string; teamId: string }>;
}) {
  const { id, teamId } = use(params);
  const store = useCohortStore();
  const cohort = store.cohorts.find((c) => c.id === id);
  const team = store.teams.find((t) => t.id === teamId && t.cohortId === id);

  const members = store.users.filter((u) => u.teamId === teamId);
  // どのチームにも配属されていない受講生（割り当て候補）
  const unassigned = store.users.filter((u) => !u.teamId);

  // チーム（または期）が見つからないときは 404 相当の案内を出す
  if (!cohort || !team) {
    return (
      <>
        <PageHeader title="チームが見つかりません" backHref={`/cohorts/${id}`} />
        <div className="mx-auto max-w-[720px] px-8 py-8 lg:px-12">
          <p className="rise text-[13.5px] text-muted">
            指定されたチームは存在しません。
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
        title={`${team.name} のメンバー`}
        description={`${cohort.name}・${team.name} に所属している受講生の一覧です。`}
        backHref={`/cohorts/${id}`}
      />

      <div className="mx-auto max-w-[720px] px-8 py-8 lg:px-12 space-y-8">
        {/* メンバー一覧 */}
        <section className="rise">
          <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-widest text-muted">
            メンバー（{members.length}名）
          </h2>
          <div className="overflow-clip rounded-xl border border-line bg-surface-raised">
            {members.length === 0 ? (
              <p className="px-4 py-10 text-center text-[13px] text-muted">
                このチームにはまだ受講生がいません。
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {members.map((u) => (
                  <li key={u.id} className="group flex items-center gap-3 px-4 py-3.5 transition hover:bg-paper/70">
                    <Link href={`/users/${u.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-medium text-ink">
                          {u.name}
                        </span>
                        <span className="block truncate text-[12px] text-muted">
                          {u.email}
                        </span>
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => unassignUser(u.id)}
                      className="shrink-0 rounded-lg border border-line-strong bg-surface px-3 py-1.5 text-[12.5px] font-semibold text-muted transition hover:border-rose hover:text-rose"
                    >
                      チームから外す
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* 未割り当てから追加 */}
        <section className="rise">
          <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-widest text-muted">
            未割り当ての受講生を追加
          </h2>
          <div className="overflow-clip rounded-xl border border-line bg-surface-raised">
            {unassigned.length === 0 ? (
              <p className="px-4 py-8 text-center text-[13px] text-muted">
                未割り当ての受講生はいません。
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {unassigned.map((u) => (
                  <li key={u.id} className="flex items-center gap-3 px-4 py-3.5">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium text-ink">
                        {u.name}
                      </span>
                      <span className="block truncate text-[12px] text-muted">
                        {u.email}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => assignUserToTeam(u.id, teamId)}
                      className="shrink-0 rounded-lg bg-accent px-3.5 py-1.5 text-[12.5px] font-semibold text-white transition hover:bg-accent-hover"
                    >
                      チームに追加
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
