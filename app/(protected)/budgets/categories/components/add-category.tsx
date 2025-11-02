"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import useFormSheetStore from "@/components/form-sheet/store"

import CategoryForm from "./form"

export function CreateCategoryButton() {
  const open = useFormSheetStore(state => state.open)

  return (
    <Button onClick={() => open("Create Category", <CategoryForm />)}>
      <Plus className="h-4 w-4" />
      Add Category
    </Button>
  )
}