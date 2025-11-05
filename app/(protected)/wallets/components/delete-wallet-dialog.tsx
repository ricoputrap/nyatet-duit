"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { deleteWallet } from "../actions"
import { IWallet } from "../types"

interface Props {
  wallet: IWallet
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteWalletDialog({ wallet, open, onOpenChange }: Props) {
  const handleDelete = async () => {
    try {
      await deleteWallet(wallet.id)
      toast.success("Wallet deleted successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to delete wallet")
      console.error(error)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the wallet "{wallet.name}". This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
