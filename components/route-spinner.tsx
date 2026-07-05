"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * ルート遷移中に中央スピナーを出す。
 * 内部リンクのクリックで表示し、pathname が変わったら消す。
 * loading.tsx（Suspense）より確実に「遷移中」が見える。
 */
export function RouteSpinner() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 内部リンクのクリックで開始
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      if (a.target && a.target !== "_self") return;
      const url = new URL(a.href, window.location.origin);
      if (url.pathname === window.location.pathname) return; // 同一ページ内
      if (hideRef.current) clearTimeout(hideRef.current);
      setActive(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // pathname が変わったら完了
  useEffect(() => {
    setActive(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!active) return null;

  return (
    // ヘッダー直下＝コンテンツ領域を覆い、開始位置に左寄せでスピナーを出す
    <div
      aria-hidden
      className="absolute inset-x-0 bottom-0 z-40 bg-paper"
      style={{ top: "var(--page-header-h, 96px)" }}
    >
      <div className="max-w-[1180px] px-8 py-9 lg:px-12">
        <span
          className="inline-flex items-center gap-2.5 text-[13px] font-medium text-muted"
          role="status"
          aria-label="読み込み中"
        >
          <svg className="h-5 w-5 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          読み込み中…
        </span>
      </div>
    </div>
  );
}
