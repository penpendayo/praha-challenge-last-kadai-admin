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
    <div className="pointer-events-none fixed inset-y-0 right-0 left-[264px] z-50 flex items-center justify-center">
      <span className="grid place-items-center rounded-2xl bg-surface-raised/90 p-4 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.25)] ring-1 ring-line backdrop-blur-sm">
        <span
          className="h-7 w-7 animate-spin rounded-full border-[3px] border-line-strong border-t-accent"
          role="status"
          aria-label="読み込み中"
        />
      </span>
    </div>
  );
}
