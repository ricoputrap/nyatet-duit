"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useFormSheetStore } from "@/components/form-sheet"
import BudgetForm from "./form"

export function CreateBudgetButton() {
  const open = useFormSheetStore((state) => state.open)

  return (
    <Button onClick={() => open("Create Budget", <BudgetForm />)}>
      <Plus className="h-4 w-4" />
      Add Budget
    </Button>
  )
}
