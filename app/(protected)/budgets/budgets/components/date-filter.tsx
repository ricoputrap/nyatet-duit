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

  const handleDateChange = (date: string) => {
    const urlParams = new URLSearchParams(window.location.search)
    if (date) {
      urlParams.set('date', date)
    } else {
      urlParams.delete('date')
    }
    startTransition(() => {
      router.replace(`?${urlParams.toString()}`)
    })
  }

  const clearDate = () => {
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.delete('date')
    startTransition(() => {
      router.replace(`?${urlParams.toString()}`)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="date"
        defaultValue={params.date || ''}
        onChange={(e) => handleDateChange(e.target.value)}
        className="w-auto"
        disabled={isPending}
      />
      {params.date && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearDate}
          disabled={isPending}
        >
          Clear
        </Button>
      )}
    </div>
  )
}
