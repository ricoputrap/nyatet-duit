"use client"

import ConfirmationDialog from "@/components/ui/confirmation-dialog"
import { IIncome } from "../types"
import { deleteIncome } from "../actions"
import { useState } from "react"
import { toast } from "sonner"

interface DeleteIncomeDialogProps {
  income: IIncome
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteIncomeDialog({ income, open, onOpenChange }: DeleteIncomeDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteIncome(income.id)
    setIsDeleting(false)
    
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Income deleted successfully')
      onOpenChange(false)
    }
  }

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Income"
      description={
        <>
          Are you sure you want to delete <strong>{income.name}</strong>? This action cannot be undone.
        </>
      }
      actionLabel="Delete"
      loadingLabel="Deleting..."
      onConfirm={handleDelete}
      isLoading={isDeleting}
    />
  )
}
