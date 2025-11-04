"use client"

import { use } from "react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { useDebouncedCallback } from "use-debounce"
import { IBudgetPageParams } from "../types"
import { formatDateToYYYYMMDD } from "@/lib/utils"

interface DateFilterProps {
  searchParams: Promise<IBudgetPageParams>
}

export function DateFilter({ searchParams }: DateFilterProps) {
  const params = use(searchParams)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDateChange = useDebouncedCallback((type: 'start_date' | 'end_date', date: Date | undefined) => {
    const urlParams = new URLSearchParams(window.location.search)
    if (date) {
      urlParams.set(type, formatDateToYYYYMMDD(date))
    } else {
      urlParams.delete(type)
    }
    startTransition(() => {
      router.replace(`?${urlParams.toString()}`)
    })
  }, 300)

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
      <DatePicker
        date={params.start_date}
        onDateChange={(date) => handleDateChange('start_date', date)}
        placeholder="Start Date"
        disabled={isPending}
        buttonClassName="h-10 w-auto"
        disabledDates={(date) => {
          if (params.end_date) {
            return date > new Date(params.end_date)
          }
          return false
        }}
      />

      <span className="text-muted-foreground">-</span>

      <DatePicker
        date={params.end_date}
        onDateChange={(date) => handleDateChange('end_date', date)}
        placeholder="End Date"
        disabled={isPending}
        buttonClassName="h-10 w-auto"
        disabledDates={(date) => {
          if (params.start_date) {
            return date < new Date(params.start_date)
          }
          return false
        }}
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
