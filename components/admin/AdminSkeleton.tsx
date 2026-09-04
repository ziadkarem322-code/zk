export function AdminSkeleton() {
  return (
    <div className="flex flex-col gap-4 max-w-3xl animate-pulse">
      <div className="h-8 w-64 bg-neutral-800 rounded" />
      <div className="h-24 w-full bg-neutral-800 rounded-lg" />
      <div className="h-24 w-full bg-neutral-800 rounded-lg" />
      <div className="h-24 w-full bg-neutral-800 rounded-lg" />
    </div>
  );
}
