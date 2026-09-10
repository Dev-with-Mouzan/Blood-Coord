import { CardSkeleton, Skeleton } from "../../components/ui/skeleton";

export function DashboardLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div className="flex flex-col gap-4 rounded-3xl border border-ink-900/10 bg-bone-50 p-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-3xl border border-ink-900/10 bg-bone-50 p-8">
        <Skeleton className="h-5 w-32" />
        <div className="grid gap-6 sm:grid-cols-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
