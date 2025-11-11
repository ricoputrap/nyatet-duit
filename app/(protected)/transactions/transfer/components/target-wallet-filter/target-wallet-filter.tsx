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

interface TargetWalletFilterProps {
  searchParams: Promise<{
    target_wallet_id?: string
  }>
  wallets: { id: string; name: string }[]
}

function TargetWalletFilterComponent({
  searchParams,
  wallets
}: TargetWalletFilterProps) {
  const params = use(searchParams)
  const router = useRouter()

  const handleValueChange = (value: string) => {
    const urlParams = new URLSearchParams(window.location.search)
    
    if (value === "all") {
      urlParams.delete('target_wallet_id')
    } else {
      urlParams.set('target_wallet_id', value)
    }
    
    router.replace(`?${urlParams.toString()}`)
  }

  return (
    <Select
      value={params.target_wallet_id || "all"}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All Targets" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Targets</SelectItem>
        {wallets.map((wallet) => (
          <SelectItem key={wallet.id} value={wallet.id}>
            {wallet.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default TargetWalletFilterComponent
