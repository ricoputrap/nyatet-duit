"use client"

import { Button } from "@/components/ui/button"
import { useFormSheetStore, FormSheet } from "@/components/form-sheet"
import TransferForm from "./form"
import { Plus } from "lucide-react"

export default function AddTransfer() {
  const open = useFormSheetStore((state) => state.open)

  const handleClick = () => {
    open("Add Transfer", <TransferForm />)
  }

  return (
    <Button onClick={handleClick}>
      <Plus className="mr-2 h-4 w-4" />
      Add
    </Button>
  )
}
