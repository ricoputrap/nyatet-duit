"use client"

import ConfirmationDialog from "@/components/ui/confirmation-dialog"
import { IBudget } from "../types"
import { deleteBudget } from "../actions"
import { useState } from "react"
import { toast } from "sonner"

interface DeleteBudgetDialogProps {
  budget: IBudget | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteBudgetDialog({ budget, open, onOpenChange }: DeleteBudgetDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!budget) return
    
    setIsDeleting(true)
    const result = await deleteBudget(budget.id)
    setIsDeleting(false)
    
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Budget deleted successfully')
      onOpenChange(false)
    }
  }

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Budget"
      description={
        <>
          Are you sure you want to delete the budget for <strong>{budget?.category_name}</strong>? This action cannot be undone.
        </>
      }
      actionLabel="Delete"
      loadingLabel="Deleting..."
      onConfirm={handleDelete}
      isLoading={isDeleting}
    />
  )
}
