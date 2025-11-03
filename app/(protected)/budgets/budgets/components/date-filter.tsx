"use client"

import { use, useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { useDebouncedCallback } from "use-debounce"
import { IBudgetPageParams } from "../types"

interface DateFilterProps {
  searchParams: Promise<IBudgetPageParams>
}

export function DateFilter({ searchParams }: DateFilterProps) {
  const params = use(searchParams)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  const handleDateChange = useDebouncedCallback((type: 'start_date' | 'end_date', value: string) => {
    const urlParams = new URLSearchParams(window.location.search)
    if (value) {
      urlParams.set(type, value)
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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return undefined
    return new Date(dateString)
  }

  const formatDateToString = (date: Date | undefined) => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  return (
    <div className="flex items-center gap-2">
      <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-10 w-auto justify-between font-normal"
            disabled={isPending}
          >
            {params.start_date ? new Date(params.start_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Start Date"}
            <CalendarIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={formatDate(params.start_date)}
            onSelect={(date) => {
              handleDateChange('start_date', formatDateToString(date))
              setStartDateOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>

      <span className="text-muted-foreground">-</span>

      <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-10 w-auto justify-between font-normal"
            disabled={isPending}
          >
            {params.end_date ? new Date(params.end_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "End Date"}
            <CalendarIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={formatDate(params.end_date)}
            onSelect={(date) => {
              handleDateChange('end_date', formatDateToString(date))
              setEndDateOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>

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
