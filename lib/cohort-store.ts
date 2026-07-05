"use client";

// ─────────────────────────────────────────────────────────────
//  期・チームの共有ストア（モック用）
//  ページ間で状態を共有し、localStorage に永続化する。
//  受講生（users）はシードデータのまま。新設チームは 0 名。
// ─────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { useSyncExternalStore } from "react";
import {
  cohorts as seedCohorts,
  teams as seedTeams,
  users as seedUsers,
  type Cohort,
  type Team,
  type User,
} from "@/lib/mock-data";

type State = {
  cohorts: Cohort[];
  teams: Team[];
  users: User[];
  currentCohortId: string;
};

const STORAGE_KEY = "praha-admin-cohort-store-v5";

function seedState(): State {
  return {
    cohorts: seedCohorts.map((c) => ({ ...c })),
    teams: seedTeams.map((t) => ({ ...t })),
    users: seedUsers.map((u) => ({ ...u })),
    currentCohortId: seedCohorts[seedCohorts.length - 1].id,
  };
}

let state: State = seedState();
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage が使えない環境では永続化しない（モックなので握りつぶす）
  }
}

function setState(next: State) {
  state = next;
  persist();
  emit();
}

// クライアントで一度だけ localStorage から復元する
function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as State;
    if (parsed?.cohorts?.length && parsed?.teams && parsed?.users && parsed?.currentCohortId) {
      state = parsed;
      emit();
    }
  } catch {
    // 壊れた保存データは無視してシードのまま進む
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const getSnapshot = () => state;

/** 期・チームの現在状態を購読する。クライアントで初回に localStorage から復元する。 */
export function useCohortStore(): State {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  useEffect(() => {
    hydrate();
  }, []);
  return snapshot;
}

// ── 操作 ─────────────────────────────────────────────

/** 新しい期を開始し、それを現在の期にする。作成した期を返す。 */
export function startCohort(): Cohort {
  const n = state.cohorts.length + 1;
  const cohort: Cohort = { id: `c${n}`, name: `${n}期` };
  setState({
    ...state,
    cohorts: [...state.cohorts, cohort],
    currentCohortId: cohort.id,
  });
  return cohort;
}

/** 期を削除する（受講生 0 名の期のみ想定）。所属チームも一緒に削除する。 */
export function deleteCohort(id: string) {
  const rest = state.cohorts.filter((c) => c.id !== id);
  const currentCohortId =
    state.currentCohortId === id && rest.length > 0
      ? rest[rest.length - 1].id
      : state.currentCohortId;
  setState({
    ...state,
    cohorts: rest,
    teams: state.teams.filter((t) => t.cohortId !== id),
    currentCohortId,
  });
}

/** 次に採番されるチーム名（期の既存チームの末尾文字 +1、無ければ A から）。 */
export function nextTeamName(cohortId: string): string {
  const cohort = state.cohorts.find((c) => c.id === cohortId);
  const prefix = cohort ? parseInt(cohort.name, 10) || cohort.name : "";
  const codes = state.teams
    .filter((t) => t.cohortId === cohortId)
    .map((t) => t.name.slice(-1).charCodeAt(0))
    .filter((code) => code >= 65 && code <= 90);
  const next = codes.length ? Math.max(...codes) + 1 : 65;
  return `${prefix}${String.fromCharCode(next)}`;
}

/** 期にチームを追加する。作成したチームを返す。 */
export function addTeam(cohortId: string): Team {
  const team: Team = {
    id: `t-${cohortId}-${Date.now()}`,
    name: nextTeamName(cohortId),
    cohortId,
  };
  setState({ ...state, teams: [...state.teams, team] });
  return team;
}

/** チームを削除する（受講生 0 名のチームのみ想定）。 */
export function deleteTeam(teamId: string) {
  setState({ ...state, teams: state.teams.filter((t) => t.id !== teamId) });
}

/** 受講生をチームに割り当てる。期はそのチームの所属期に合わせる。 */
export function assignUserToTeam(userId: string, teamId: string) {
  const team = state.teams.find((t) => t.id === teamId);
  if (!team) return;
  setState({
    ...state,
    users: state.users.map((u) =>
      u.id === userId ? { ...u, teamId, cohortId: team.cohortId } : u,
    ),
  });
}

/** 受講生の情報を更新する（詳細ページの保存）。 */
export function updateUser(userId: string, patch: Partial<User>) {
  setState({
    ...state,
    users: state.users.map((u) => (u.id === userId ? { ...u, ...patch } : u)),
  });
}

/** 受講生をチームから外す（未割り当てに戻す）。 */
export function unassignUser(userId: string) {
  setState({
    ...state,
    users: state.users.map((u) =>
      u.id === userId ? { ...u, teamId: "", cohortId: "" } : u,
    ),
  });
}
