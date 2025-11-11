"use client"

import ConfirmationDialog from "@/components/ui/confirmation-dialog"
import { IExpense } from "../types"
import { deleteExpense } from "../actions"
import { useState } from "react"
import { toast } from "sonner"

interface DeleteExpenseDialogProps {
  expense: IExpense
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteExpenseDialog({ expense, open, onOpenChange }: DeleteExpenseDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteExpense(expense.id)
    setIsDeleting(false)
    
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Expense deleted successfully')
      onOpenChange(false)
    }
  }

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Expense"
      description={
        <>
          Are you sure you want to delete <strong>{expense.name}</strong>? This action cannot be undone.
        </>
      }
      actionLabel="Delete"
      loadingLabel="Deleting..."
      onConfirm={handleDelete}
      isLoading={isDeleting}
    />
  )
}
