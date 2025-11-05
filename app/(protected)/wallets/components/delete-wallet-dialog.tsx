"use client"

import ConfirmationDialog from "@/components/ui/confirmation-dialog"
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
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Are you sure?"
      description={`This will permanently delete the wallet "${wallet.name}". This action cannot be undone.`}
      actionLabel="Delete"
      onConfirm={handleDelete}
    />
  )
}
