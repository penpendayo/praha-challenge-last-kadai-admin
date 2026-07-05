// ─────────────────────────────────────────────────────────────
//  モックデータ（DBは考慮しない。UIのイメージ確認用）
//  課題・ジャンルは student-demo のカリキュラム構成に準拠
//  （apps/student-demo/astro.config.mjs のサイドバー定義）
// ─────────────────────────────────────────────────────────────

export type Cohort = {
  id: string;
  /** 期の表示名 e.g. "3期" */
  name: string;
};

export type Genre = {
  id: string;
  name: string;
  /** アクセント色のトークン名 */
  color: "accent" | "sky" | "amber" | "rose";
};

export type Challenge = {
  id: string;
  genreId: string;
  title: string;
  /** ジャンル内の並び順 */
  order: number;
};

export type Team = {
  id: string;
  name: string;
  cohortId: string;
};

/** 受講生の在籍ステータス */
export type UserStatus = "trial" | "enrolled" | "paused" | "graduated" | "withdrawn";
export const userStatusMeta: Record<UserStatus, { label: string }> = {
  trial: { label: "お試し" },
  enrolled: { label: "在籍" },
  paused: { label: "休会" },
  graduated: { label: "卒業" },
  withdrawn: { label: "退会" },
};
/** 未設定ユーザーの既定ステータス */
export const DEFAULT_USER_STATUS: UserStatus = "enrolled";

export type User = {
  id: string;
  name: string;
  email: string;
  cohortId: string;
  teamId: string;
  /** アバターに使うイニシャル */
  initial: string;
  joinedAt: string;
  /** 在籍ステータス（未設定なら在籍扱い）*/
  status?: UserStatus;
};

/** 支払い状況（毎月払い方式。月ごとに支払い済み/未払い）*/
export type PaymentStatus = "paid" | "unpaid";
export const paymentStatusMeta: Record<
  PaymentStatus,
  { label: string; token: "accent" | "rose" }
> = {
  paid: { label: "支払い済み", token: "accent" },
  unpaid: { label: "未払い", token: "rose" },
};
/** 月額（円）*/
export const MONTHLY_FEE = 10000;
/** 集計の基準となる当月（モックなので固定）*/
export const CURRENT_MONTH = "2026-07";

export type Payment = {
  userId: string;
  /** 対象月 YYYY-MM */
  month: string;
  status: PaymentStatus;
  amount: number;
  /** 入金日（支払い済みのときのみ）YYYY-MM-DD */
  paidAt?: string;
};

export type ProgressStatus = "done" | "todo" | "locked";

// ── 期（1期からはじまる）────────────────────────────
export const cohorts: Cohort[] = [
  { id: "c1", name: "1期" },
  { id: "c2", name: "2期" },
  { id: "c3", name: "3期" },
];

// ── 課題ジャンル ─────────────────────────────────────
export const genres: Genre[] = [
  { id: "g-db", name: "データベース設計", color: "sky" },
  { id: "g-sql", name: "SQL", color: "accent" },
  { id: "g-design", name: "設計", color: "amber" },
  { id: "g-test", name: "テスト", color: "rose" },
];

// ── 課題（ジャンルごと。student-demo の章立てに準拠）──────────
const rawChallenges: Record<string, string[]> = {
  "g-db": [
    "データベースモデリング1",
    "データベースモデリング2",
    "データベースモデリング3",
    "データベースモデリング4",
    "データベースモデリング5",
    "アンチパターン1",
    "アンチパターン2",
    "アンチパターン3",
    "アンチパターン4",
    "アンチパターン5",
    "アンチパターン6",
    "アンチパターン7",
    "アンチパターン8",
    "アンチパターン9",
    "モデリングを見直す",
    "マルチテナント",
    "外部キー制約",
    "NULL の扱い",
  ],
  "g-sql": [
    "SQL10本ノック",
    "インデックスを理解する",
    "スロークエリを理解する",
    "ビューを使いこなす",
    "トランザクションについて理解する",
  ],
  "g-design": [
    "基本的な設計原則",
    "オニオンアーキテクチャを学ぶ",
    "リファクタリング",
    "DDDを学ぶ（基礎）",
    "DDDを学ぶ（応用）",
    "特大課題：プラハチャレンジをDDDで実装してみる",
  ],
  "g-test": [
    "jestで単体テストを書こう",
    "Storybookでコンポーネントの動作確認をしよう",
    "ビジュアルリグレッションテストを書こう",
    "E2Eテストを書こう",
    "TDD(テスト駆動開発)でコードを書いてみる",
  ],
  // v2 で追加されるジャンルの課題
  "g-sec": [
    "OWASP Top 10 を理解する",
    "認証と認可を実装する",
    "XSS・CSRF対策",
    "セキュアなパスワード管理",
    "脆弱性スキャンを回す",
  ],
  "g-perf": [
    "計測から始める",
    "N+1問題を解消する",
    "インデックスとクエリ最適化",
    "キャッシュ戦略を立てる",
    "負荷試験を行う",
  ],
};

// ── 特定の期にだけ存在するジャンル ───────────────────────
// 通常ジャンルとは別枠。genresByCohort() で対象の期にだけ差し込む。
export const cohortGenres: (Genre & { cohortId: string })[] = [
  { id: "g-c3-only", name: "3期でだけ追加されたジャンル", color: "rose", cohortId: "c3" },
];

/** 指定した期で表示すべきジャンル一覧（共通ジャンル＋その期限定ジャンル）*/
export const genresByCohort = (cohortId: string): Genre[] => [
  ...genres,
  ...cohortGenres.filter((g) => g.cohortId === cohortId),
];

// ── チーム（期に紐づく）──────────────────────────────
export const teams: Team[] = [
  { id: "t-1a", name: "1A", cohortId: "c1" },
  { id: "t-1b", name: "1B", cohortId: "c1" },
  { id: "t-2a", name: "2A", cohortId: "c2" },
  { id: "t-2b", name: "2B", cohortId: "c2" },
  { id: "t-3a", name: "3A", cohortId: "c3" },
  { id: "t-3b", name: "3B", cohortId: "c3" },
];

// ── カリキュラム版 ───────────────────────────────────
export type Curriculum = { id: string; name: string };
export const curriculums: Curriculum[] = [
  { id: "v1", name: "v1" },
  { id: "v2", name: "v2" },
];

// 期ごとのデフォルトのカリキュラム版（期単位で決まる）
export const cohortDefaultVersion: Record<string, string> = {
  c1: "v1",
  c2: "v1",
  c3: "v2",
};

// v2 で増えるジャンル（版によってジャンル構成が変わることを表現するため）
export const extraGenres: Genre[] = [
  { id: "g-sec", name: "セキュリティ", color: "amber" },
  { id: "g-perf", name: "パフォーマンス", color: "sky" },
];
export const allGenres: Genre[] = [...genres, ...extraGenres];

// カリキュラム版ごとのジャンル構成（v1 → v2 でジャンルが増減する）
//   v2: SQL を廃止し、セキュリティ・パフォーマンスを追加、という体
export const genreIdsByVersion: Record<string, string[]> = {
  v1: ["g-db", "g-sql", "g-design", "g-test"],
  v2: ["g-db", "g-design", "g-test", "g-sec", "g-perf"],
};
export const genresByVersion = (version: string): Genre[] =>
  (genreIdsByVersion[version] ?? []).map((id) => allGenres.find((g) => g.id === id)!);

// 課題（全ジャンル分をまとめて生成。版ごとの出し分けは表示側で行う）
export const challenges: Challenge[] = allGenres.flatMap((g) =>
  (rawChallenges[g.id] ?? []).map((title, i) => ({
    id: `${g.id}-${i + 1}`,
    genreId: g.id,
    title,
    order: i + 1,
  })),
);

// チームごとの利用カリキュラム版
//   main : 進捗・解放・完了リクエストの対象（1つ）
export type TeamVersion = { main: string };
export const initialTeamVersions: Record<string, TeamVersion> = {
  "t-1a": { main: "v1" },
  "t-1b": { main: "v1" },
  "t-2a": { main: "v1" },
  "t-2b": { main: "v1" },
  "t-3a": { main: "v2" },
  "t-3b": { main: "v2" },
};

// 課題開放（チーム × 版 × ジャンル）
// key: `${teamId}:${version}:${genreId}` → 閲覧可能なら true
// 既定：メイン版のジャンルは期の進み具合に応じて開放、それ以外の版は閉じておく。
export const initialGenreAccessV: Record<string, boolean> = (() => {
  const map: Record<string, boolean> = {};
  for (const t of teams) {
    const mainV = initialTeamVersions[t.id].main;
    for (const cur of curriculums) {
      const vGenres = genresByVersion(cur.id);
      const cohortIndex = cohorts.findIndex((c) => c.id === t.cohortId);
      vGenres.forEach((g, gi) => {
        map[`${t.id}:${cur.id}:${g.id}`] =
          cur.id === mainV ? gi <= cohortIndex + 1 : false;
      });
    }
  }
  return map;
})();

// ── ユーザー ─────────────────────────────────────────
export const users: User[] = [
  { id: "u1", name: "佐藤 陽向", email: "hinata.sato@example.com", cohortId: "c3", teamId: "t-3a", initial: "陽", joinedAt: "2026-04-01" },
  { id: "u2", name: "鈴木 蓮", email: "ren.suzuki@example.com", cohortId: "c3", teamId: "t-3a", initial: "蓮", joinedAt: "2026-04-01" },
  { id: "u3", name: "高橋 葵", email: "aoi.takahashi@example.com", cohortId: "c3", teamId: "t-3a", initial: "葵", joinedAt: "2026-04-01" },
  { id: "u4", name: "田中 凛", email: "rin.tanaka@example.com", cohortId: "c3", teamId: "t-3b", initial: "凛", joinedAt: "2026-04-08" },
  { id: "u5", name: "伊藤 湊", email: "minato.ito@example.com", cohortId: "c3", teamId: "t-3b", initial: "湊", joinedAt: "2026-04-08" },
  { id: "u6", name: "渡辺 結衣", email: "yui.watanabe@example.com", cohortId: "c2", teamId: "t-2a", initial: "結", joinedAt: "2026-01-10" },
  { id: "u7", name: "山本 大和", email: "yamato.yamamoto@example.com", cohortId: "c2", teamId: "t-2a", initial: "大", joinedAt: "2026-01-10" },
  { id: "u8", name: "中村 咲良", email: "sakura.nakamura@example.com", cohortId: "c2", teamId: "t-2b", initial: "咲", joinedAt: "2026-01-15" },
  { id: "u9", name: "小林 悠真", email: "yuma.kobayashi@example.com", cohortId: "c2", teamId: "t-2b", initial: "悠", joinedAt: "2026-01-15" },
  { id: "u10", name: "加藤 芽依", email: "mei.kato@example.com", cohortId: "c1", teamId: "t-1a", initial: "芽", joinedAt: "2025-10-02" },
  { id: "u11", name: "吉田 颯", email: "hayate.yoshida@example.com", cohortId: "c1", teamId: "t-1a", initial: "颯", joinedAt: "2025-10-02" },
  { id: "u12", name: "山田 詩", email: "uta.yamada@example.com", cohortId: "c1", teamId: "t-1b", initial: "詩", joinedAt: "2025-10-09" },
  // チーム未割り当て（cohortId / teamId が空）。まだどのチームにも配属されていない受講生。
  { id: "u13", name: "岡田 新", email: "arata.okada@example.com", cohortId: "", teamId: "", initial: "新", joinedAt: "2026-07-01" },
  { id: "u14", name: "近藤 未来", email: "mirai.kondo@example.com", cohortId: "", teamId: "", initial: "未", joinedAt: "2026-07-02" },
  // 休会中でチーム未割り当ての受講生
  { id: "u15", name: "森田 律", email: "ritsu.morita@example.com", cohortId: "", teamId: "", initial: "律", joinedAt: "2026-02-03", status: "paused" },
  { id: "u16", name: "石川 遥", email: "haruka.ishikawa@example.com", cohortId: "", teamId: "", initial: "遥", joinedAt: "2025-11-12", status: "paused" },
  // お試し中でチーム未割り当ての受講生
  { id: "u17", name: "藤井 蒼", email: "aoi.fujii@example.com", cohortId: "", teamId: "", initial: "蒼", joinedAt: "2026-06-25", status: "trial" },
  { id: "u18", name: "岡 心春", email: "koharu.oka@example.com", cohortId: "", teamId: "", initial: "心", joinedAt: "2026-07-03", status: "trial" },
];

// ── 支払い履歴（ユーザー × 月）──────────────────────────
// 入会月〜当月までの各月について、支払い済み/未払いを疑似生成する。
function monthsBetween(startYm: string, endYm: string): string[] {
  const [sy, sm] = startYm.split("-").map(Number);
  const [ey, em] = endYm.split("-").map(Number);
  const out: string[] = [];
  let y = sy;
  let m = sm;
  while (y < ey || (y === ey && m <= em)) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return out;
}

// 文字列から安定した擬似ハッシュを作る（乱数を使わず決定的にするため）
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export const payments: Payment[] = users.flatMap((u) => {
  // お試しユーザーは一度も課金されていないので支払い履歴を作らない。
  // （在籍に変更しても「支払い済み」にはならず、未払いから始まる）
  if ((u.status ?? DEFAULT_USER_STATUS) === "trial") return [];
  const start = u.joinedAt.slice(0, 7);
  return monthsBetween(start, CURRENT_MONTH).map((month) => {
    const isCurrent = month === CURRENT_MONTH;
    // 当月は一部のユーザーが未払い、過去月はたまに未払いが混ざる、という体
    const unpaid = isCurrent
      ? hashStr(u.id) % 3 === 0
      : hashStr(`${u.id}:${month}`) % 11 === 0;
    const status: PaymentStatus = unpaid ? "unpaid" : "paid";
    return {
      userId: u.id,
      month,
      status,
      amount: MONTHLY_FEE,
      paidAt: status === "paid" ? `${month}-08` : undefined,
    };
  });
});

/** ユーザーの支払い履歴（新しい月が先頭）*/
export const paymentsByUser = (userId: string): Payment[] =>
  payments
    .filter((p) => p.userId === userId)
    .sort((a, b) => (a.month < b.month ? 1 : -1));

/** ユーザーの当月支払い状況（記録がなければ未払い扱い）*/
export const currentPaymentStatus = (userId: string): PaymentStatus =>
  payments.find((p) => p.userId === userId && p.month === CURRENT_MONTH)?.status ??
  "unpaid";

// 表示用の支払い状況。在籍以外（休会・卒業・退会）は支払い不要なので「対象外」。
export type PaymentDisplayStatus = PaymentStatus | "exempt";
export const PAYMENT_EXEMPT_LABEL = "対象外";

/** ユーザーが支払い対象か（在籍のみ対象）*/
export const isPaymentApplicable = (user: User): boolean =>
  (user.status ?? DEFAULT_USER_STATUS) === "enrolled";

/** ユーザーの当月の表示用支払い状況（在籍以外は対象外）*/
export const currentPaymentDisplay = (user: User): PaymentDisplayStatus =>
  isPaymentApplicable(user) ? currentPaymentStatus(user.id) : "exempt";

// ── 課題開放（チーム × ジャンル の閲覧可否）─────────────────
// key: `${teamId}:${genreId}` → 閲覧可能なら true
export const initialGenreAccess: Record<string, boolean> = (() => {
  const map: Record<string, boolean> = {};
  for (const t of teams) {
    for (const g of genres) {
      // 期が進むほど多くのジャンルが開放されている、という体で初期値を作る
      const cohortIndex = cohorts.findIndex((c) => c.id === t.cohortId);
      const genreIndex = genres.findIndex((x) => x.id === g.id);
      map[`${t.id}:${g.id}`] = genreIndex <= cohortIndex + 1;
    }
  }
  // 手動で少し変化をつける
  map["t-3a:g-test"] = true;
  map["t-3b:g-test"] = false;
  // 期限定ジャンルの初期値（対象の期のチームにだけキーを用意する）
  for (const cg of cohortGenres) {
    for (const t of teams.filter((t) => t.cohortId === cg.cohortId)) {
      map[`${t.id}:${cg.id}`] = false;
    }
  }
  return map;
})();

// ── 進捗（ユーザー × 課題 → ステータス）──────────────────
// 到達点までを完了、それ以降は未着手として埋める
export const initialProgress: Record<string, ProgressStatus> = (() => {
  const map: Record<string, ProgressStatus> = {};
  const ordered = [...challenges].sort((a, b) => {
    const ga = allGenres.findIndex((g) => g.id === a.genreId);
    const gb = allGenres.findIndex((g) => g.id === b.genreId);
    return ga - gb || a.order - b.order;
  });
  users.forEach((u, ui) => {
    // ユーザーごとの到達点（何個目の課題まで進んでいるか）
    const reach = 4 + ((ui * 7 + 5) % (ordered.length - 2));
    ordered.forEach((ch, ci) => {
      map[`${u.id}:${ch.id}`] = ci < reach ? "done" : "todo";
    });
  });
  return map;
})();

// ── ヘルパー ─────────────────────────────────────────
export const genreById = (id: string) => genres.find((g) => g.id === id)!;
export const cohortById = (id: string) => cohorts.find((c) => c.id === id)!;
export const teamById = (id: string) => teams.find((t) => t.id === id)!;

export const teamsByCohort = (cohortId: string) =>
  teams.filter((t) => t.cohortId === cohortId);

export const usersByCohort = (cohortId: string) =>
  users.filter((u) => u.cohortId === cohortId);

export const challengesByGenre = (genreId: string) =>
  challenges.filter((c) => c.genreId === genreId).sort((a, b) => a.order - b.order);

/** ジャンル順→課題順に並んだ全課題 */
export function orderedChallenges(): Challenge[] {
  return genres.flatMap((g) => challengesByGenre(g.id));
}

export const statusMeta: Record<
  ProgressStatus,
  { label: string; short: string; token: "accent" | "sky" | "amber" | "line" }
> = {
  done: { label: "完了", short: "済", token: "accent" },
  todo: { label: "未着手", short: "—", token: "line" },
  locked: { label: "未解放", short: "鍵", token: "line" },
};
