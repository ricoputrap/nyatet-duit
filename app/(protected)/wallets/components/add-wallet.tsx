"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useFormSheetStore } from "@/components/form-sheet"
import WalletForm from "./form"

export function CreateWalletButton() {
  const open = useFormSheetStore((state) => state.open)

  const handleClick = () => {
    open("Create Wallet", <WalletForm />)
  }

  return (
    <Button onClick={handleClick}>
      <Plus className="h-4 w-4" />
      Add Wallet
    </Button>
  )
}
