"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください。");
      return;
    }
    // モックなので認証はせず、そのまま管理画面へ遷移する
    setLoading(true);
    setTimeout(() => router.push("/users"), 500);
  }

  return (
    <div className="grid min-h-screen place-items-center px-6 py-12">
      <div className="w-full max-w-[400px]">
        {/* ブランド */}
        <div className="mb-8 text-center">
          <span className="font-display text-[20px] font-bold tracking-wide text-ink">
            PrAha Challenge Admin
          </span>
          <p className="mt-1.5 text-[13px] text-muted">管理コンソールにログイン</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-line bg-surface-raised px-7 py-8 shadow-[0_1px_0_rgba(0,0,0,0.02),0_12px_30px_-24px_rgba(27,26,22,0.35)]"
        >
          <div className="space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">
                メールアドレス
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="admin@praha-inc.com"
                className="w-full rounded-xl border border-line-strong bg-surface px-4 py-2.5 text-[14px] text-ink outline-none transition placeholder:text-faint focus:border-accent focus:ring-4 focus:ring-accent/10"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">
                パスワード
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-line-strong bg-surface px-4 py-2.5 text-[14px] text-ink outline-none transition placeholder:text-faint focus:border-accent focus:ring-4 focus:ring-accent/10"
              />
            </label>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-rose-soft px-3 py-2 text-[12.5px] font-medium text-rose">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-accent px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-faint"
          >
            {loading ? "ログイン中…" : "ログイン"}
          </button>

          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-[12.5px] font-medium text-accent transition hover:underline"
            >
              パスワードをお忘れですか？
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-[11.5px] text-faint">
          社内向け管理画面（モック）
        </p>
      </div>
    </div>
  );
}
