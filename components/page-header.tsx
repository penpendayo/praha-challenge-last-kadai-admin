"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  backHref,
  onBack,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  /** 指定すると、タイトル左に「＜」戻るボタン（リンク）を表示する */
  backHref?: string;
  /** ページ内で戻る場合のコールバック（backHref の代わり） */
  onBack?: () => void;
}) {
  const backClass =
    "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line-strong bg-surface text-ink-2 transition hover:bg-paper hover:text-ink";
  const backIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const ref = useRef<HTMLElement>(null);

  // ヘッダーは可変高なので、実高さを CSS 変数で公開し、
  // ページ側の sticky 要素が top のオフセットとして参照できるようにする
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      document.documentElement.style.setProperty(
        "--page-header-h",
        `${el.offsetHeight}px`,
      );
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <header
      ref={ref}
      className="border-b border-line bg-paper"
    >
      <div className="flex max-w-[1180px] items-end justify-between gap-6 px-8 py-6 lg:px-12">
        <div className="flex items-center gap-3">
          {backHref ? (
            <Link href={backHref} aria-label="一覧に戻る" className={backClass}>
              {backIcon}
            </Link>
          ) : onBack ? (
            <button type="button" onClick={onBack} aria-label="一覧に戻る" className={backClass}>
              {backIcon}
            </button>
          ) : null}
          <div>
          {eyebrow && (
            <p className="tabular mb-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-[28px] font-bold leading-none tracking-tight text-ink">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-muted">
              {description}
            </p>
          )}
          </div>
        </div>
        {actions && <div className="shrink-0 pb-1">{actions}</div>}
      </div>
    </header>
  );
}
