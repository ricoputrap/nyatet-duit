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

interface SourceWalletFilterProps {
  searchParams: Promise<{
    source_wallet_id?: string
  }>
  wallets: { id: string; name: string }[]
}

function SourceWalletFilterComponent({
  searchParams,
  wallets
}: SourceWalletFilterProps) {
  const params = use(searchParams)
  const router = useRouter()

  const handleValueChange = (value: string) => {
    const urlParams = new URLSearchParams(window.location.search)
    
    if (value === "all") {
      urlParams.delete('source_wallet_id')
    } else {
      urlParams.set('source_wallet_id', value)
    }
    
    router.replace(`?${urlParams.toString()}`)
  }

  return (
    <Select
      value={params.source_wallet_id || "all"}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All Sources" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Sources</SelectItem>
        {wallets.map((wallet) => (
          <SelectItem key={wallet.id} value={wallet.id}>
            {wallet.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SourceWalletFilterComponent
