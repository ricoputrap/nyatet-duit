"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useBudgetFormStore } from "../store"

export function CreateBudgetButton() {
  const openCreate = useBudgetFormStore((state) => state.openCreate)

  return (
    <Button onClick={openCreate}>
      <Plus className="h-4 w-4" />
      Add
    </Button>
  )
}
