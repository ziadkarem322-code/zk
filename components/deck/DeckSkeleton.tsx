/** Shown only when there's truly no category data yet (no SSR initialData available). */
export function DeckSkeleton() {
  return (
    <div className="fixed inset-0 bg-[#0b0d0f] flex items-center justify-center overflow-hidden">
      <div className="w-full h-full max-w-[1920px] max-h-[1080px] grid grid-cols-2 animate-pulse" style={{ padding: "80px 88px" }}>
        <div className="flex flex-col justify-between pr-12">
          <div className="h-6 w-56 bg-white/10 rounded" />
          <div className="space-y-4">
            <div className="h-24 w-full bg-white/10 rounded" />
            <div className="h-6 w-72 bg-white/10 rounded" />
          </div>
          <div className="h-10 w-40 bg-white/10 rounded" />
        </div>
        <div className="bg-white/5 rounded border border-white/10" />
      </div>
    </div>
  );
}
