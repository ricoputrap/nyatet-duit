import { Skeleton } from "@/components/ui/skeleton"

export function DateFilterLoading() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-10 w-[140px]" />
      <span className="text-muted-foreground">-</span>
      <Skeleton className="h-10 w-[140px]" />
    </div>
  )
}
