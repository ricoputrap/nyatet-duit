"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useFormSheetStore } from "@/components/form-sheet"
import SavingForm from "./form"

export default function AddSaving() {
  const open = useFormSheetStore((state) => state.open)

  const handleClick = () => {
    open("Add Saving", <SavingForm />)
  }

  return (
    <Button onClick={handleClick}>
      <Plus className="h-4 w-4" />
      Add
    </Button>
  )
}
