import type { HTMLAttributes, ReactNode } from "react";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={"animate-pulse rounded-xl bg-ink-900/8 " + (className ?? "")}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="flex min-h-[10rem] flex-col gap-4 rounded-3xl border border-ink-900/10 bg-bone-50 p-7">
      <Skeleton className="h-12 w-12" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}