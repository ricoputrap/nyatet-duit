"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useFormSheetStore } from "@/components/form-sheet"
import ExpenseForm from "./form"

export function CreateExpenseButton() {
  const open = useFormSheetStore((state) => state.open)

  const handleClick = () => {
    open("Add Expense", <ExpenseForm />)
  }

  return (
    <Button onClick={handleClick}>
      <Plus className="mr-2 h-4 w-4" />
      Add
    </Button>
  )
}
