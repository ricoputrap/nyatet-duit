import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="rounded-md border">
      <div className="p-4">
        <Skeleton className="h-10 w-full" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border-t p-4">
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  )
}
