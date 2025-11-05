"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"

export function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get("search") || ""

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set("search", value)
    } else {
      params.delete("search")
    }
    router.push(`/wallets?${params.toString()}`)
  }

  return (
    <Input
      type="text"
      placeholder="Search wallets..."
      value={search}
      onChange={(e) => handleSearch(e.target.value)}
      className="max-w-sm"
    />
  )
}
