import React from "react"
import { toast } from "sonner"

import { TextField, NumberField, ActionButtons, useFormSheetStore } from "@/components/form-sheet"
import { createWallet, updateWallet } from "../actions"
import { IWallet } from "../types"

interface Props {
  wallet?: IWallet
}

export default function WalletForm({ wallet }: Props) {
  const close = useFormSheetStore((state) => state.close)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const balance = Number(formData.get("balance"))

    if (wallet) {
      await updateWallet(wallet.id, name, balance)
      toast.success("Wallet updated successfully")
    } else {
      await createWallet(name, balance)
      toast.success("Wallet created successfully")
    }

    close()
  }

  return (
    <form className="flex flex-col flex-1 px-4 pb-4" onSubmit={handleSubmit}>
      <div className="flex-1 space-y-6">
        <TextField
          id="name"
          title="Wallet Name"
          defaultValue={wallet?.name || ""}
          placeholder="Enter wallet name..."
          required
          autoFocus
        />

        <NumberField
          id="balance"
          title="Initial Balance"
          defaultValue={wallet?.balance || 0}
          placeholder="Enter initial balance..."
          required
        />
      </div>

      <ActionButtons isEdit={!!wallet} close={close} />
    </form>
  )
}
