"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ISaving } from "@/app/(protected)/savings/types"

interface GoalFilterProps {
  savings: ISaving[]
}

export default function GoalFilterSelect({ savings }: GoalFilterProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleFilter = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== "all") {
      params.set("saving_id", value)
    } else {
      params.delete("saving_id")
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Select
      defaultValue={searchParams.get("saving_id") || "all"}
      onValueChange={handleFilter}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All Goals" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Goals</SelectItem>
        {savings.map((saving) => (
          <SelectItem key={saving.id} value={saving.id}>
            {saving.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
