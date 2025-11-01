"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useCategoryFormStore } from "../store"

export function CreateCategoryButton() {
  const openCreate = useCategoryFormStore((state) => state.openCreate)

  return (
    <Button onClick={openCreate}>
      <Plus className="h-4 w-4" />
      Add Category
    </Button>
  )
}