"use client"

import React, { use } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'

interface WalletFilterProps {
  searchParams: Promise<{
    wallet_id?: string
  }>
  wallets: { id: string; name: string }[]
}

function WalletFilterComponent({
  searchParams,
  wallets
}: WalletFilterProps) {
  const params = use(searchParams)
  const router = useRouter()

  const handleValueChange = (value: string) => {
    const urlParams = new URLSearchParams(window.location.search)
    
    if (value === "all") {
      urlParams.delete('wallet_id')
    } else {
      urlParams.set('wallet_id', value)
    }
    
    router.replace(`?${urlParams.toString()}`)
  }

  return (
    <Select
      value={params.wallet_id || "all"}
      onValueChange={handleValueChange}
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

export default WalletFilterComponent
