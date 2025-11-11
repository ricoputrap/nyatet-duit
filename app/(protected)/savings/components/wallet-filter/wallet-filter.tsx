"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { IWallet } from "@/app/(protected)/wallets/types"

interface WalletFilterProps {
  wallets: IWallet[]
}

export default function WalletFilterSelect({ wallets }: WalletFilterProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleFilter = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== "all") {
      params.set("wallet_id", value)
    } else {
      params.delete("wallet_id")
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Select
      defaultValue={searchParams.get("wallet_id") || "all"}
      onValueChange={handleFilter}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All Wallets" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Wallets</SelectItem>
        {wallets.map((wallet) => (
          <SelectItem key={wallet.id} value={wallet.id}>
            {wallet.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
