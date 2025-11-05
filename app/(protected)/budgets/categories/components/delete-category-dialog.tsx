"use client"

import ConfirmationDialog from "@/components/ui/confirmation-dialog"
import { ICategory } from "../types"
import { deleteCategory } from "../actions"
import { useState } from "react"
import { toast } from "sonner"

interface DeleteCategoryDialogProps {
  category: ICategory | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteCategoryDialog({ category, open, onOpenChange }: DeleteCategoryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!category) return
    
    setIsDeleting(true)
    await deleteCategory(category.id)
    toast.success('Category deleted successfully')
    setIsDeleting(false)
    onOpenChange(false)
  }

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Category"
      description={
        <>
          Are you sure you want to delete <strong>{category?.name}</strong>? This action cannot be undone.
        </>
      }
      actionLabel="Delete"
      loadingLabel="Deleting..."
      onConfirm={handleDelete}
      isLoading={isDeleting}
    />
  )
}
