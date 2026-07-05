/**
 * ルート遷移中に一瞬表示するスケルトン（loading.tsx から使う）。
 * ヘッダー帯＋コンテンツのプレースホルダで「読み込み中」を即座に示す。
 */
export function PageSkeleton({
  narrow = false,
  rows = 3,
}: {
  narrow?: boolean;
  rows?: number;
}) {
  const maxW = narrow ? "max-w-[720px]" : "max-w-[1180px]";
  return (
    <div className="animate-pulse">
      {/* ヘッダー帯 */}
      <div className="border-b border-line bg-paper">
        <div className={`${maxW} px-8 py-6 lg:px-12`}>
          <div className="h-7 w-44 rounded-md bg-line-strong/70" />
          <div className="mt-3 h-3.5 w-72 rounded bg-line" />
        </div>
      </div>

      {/* コンテンツ */}
      <div className={`${maxW} space-y-3 px-8 py-8 lg:px-12`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-xl border border-line bg-surface-raised"
          />
        ))}
      </div>
    </div>
  );
}
