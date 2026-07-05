"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// デフォルトで入力しておくサンプル値（認証はしないので何でもよい）
const SAMPLE_EMAIL = "admin@praha-inc.com";
const SAMPLE_PASSWORD = "praha1234";

export default function LoginPage() {
  const router = useRouter();
  // デフォルトで入力済みにしておく（そのままログインできる）
  const [email, setEmail] = useState(SAMPLE_EMAIL);
  const [password, setPassword] = useState(SAMPLE_PASSWORD);
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // モックなので認証はせず、どんな入力でも管理画面へ遷移する
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

          <p className="mt-5 rounded-lg bg-accent-soft px-3 py-2 text-center text-[12px] font-medium text-accent-ink">
            モックのため、どんな内容を入力してもログインできます
          </p>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-accent px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-faint"
          >
            {loading ? "ログイン中…" : "ログイン"}
          </button>
        </form>

        <p className="mt-6 text-center text-[11.5px] text-faint">
          社内向け管理画面（モック）
        </p>
      </div>
    </div>
  );
}
