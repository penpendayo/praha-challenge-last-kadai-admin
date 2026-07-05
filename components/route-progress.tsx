"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * 画面上部のルート遷移プログレスバー。
 * 内部リンクのクリックで開始し、pathname が変わったら完了させる。
 * loading.tsx より確実に「遷移中」フィードバックが見える（短い遷移でも一瞬伸びる）。
 */
export function RouteProgress() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const doneRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

      if (tickRef.current) clearInterval(tickRef.current);
      if (doneRef.current) clearTimeout(doneRef.current);
      setActive(true);
      setWidth(10);
      tickRef.current = setInterval(() => {
        setWidth((w) => (w < 90 ? w + (90 - w) * 0.12 : w));
      }, 180);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // pathname が変わったら完了（100%→フェードアウト）
  useEffect(() => {
    if (!active) return;
    if (tickRef.current) clearInterval(tickRef.current);
    setWidth(100);
    doneRef.current = setTimeout(() => {
      setActive(false);
      setWidth(0);
    }, 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]">
      <div
        className="h-full bg-accent shadow-[0_0_8px_rgba(0,124,255,0.5)] transition-[width,opacity] duration-200 ease-out"
        style={{ width: `${width}%`, opacity: active ? 1 : 0 }}
      />
    </div>
  );
}
