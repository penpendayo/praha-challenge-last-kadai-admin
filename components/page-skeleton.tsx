/**
 * ルート遷移中に表示するローディング（loading.tsx から使う）。
 * 中央にスピナーを出すだけのシンプルな表示。
 */
export function PageSkeleton() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <span
        className="inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-line-strong border-t-accent"
        role="status"
        aria-label="読み込み中"
      />
    </div>
  );
}
