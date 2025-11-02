"use client"

import { use } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { IBudgetPageParams } from "../types"

interface DateFilterProps {
  searchParams: Promise<IBudgetPageParams>
}

export function DateFilter({ searchParams }: DateFilterProps) {
  const params = use(searchParams)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDateChange = (type: 'start_date' | 'end_date', value: string) => {
    const urlParams = new URLSearchParams(window.location.search)
    if (value) {
      urlParams.set(type, value)
    } else {
      urlParams.delete(type)
    }
    startTransition(() => {
      router.replace(`?${urlParams.toString()}`)
    })
  }

  const clearFilters = () => {
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.delete('start_date')
    urlParams.delete('end_date')
    startTransition(() => {
      router.replace(`?${urlParams.toString()}`)
    })
  }

  const hasFilters = params.start_date || params.end_date

  return (
    <div className="flex items-center gap-2">
      <Input
        type="date"
        value={params.start_date || ''}
        onChange={(e) => handleDateChange('start_date', e.target.value)}
        className="w-auto h-10"
        disabled={isPending}
      />
      <span className="text-muted-foreground">-</span>
      <Input
        type="date"
        value={params.end_date || ''}
        onChange={(e) => handleDateChange('end_date', e.target.value)}
        className="w-auto h-10"
        disabled={isPending}
      />
      {hasFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          disabled={isPending}
        >
          Clear
        </Button>
      )}
    </div>
  )
}
