"use client"

import React from 'react'
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export default function Search() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [value, setValue] = React.useState(searchParams.get('search') || '')

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    
    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }
    
    router.replace(`?${params.toString()}`)
  }, 300)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    handleSearch(newValue)
  }

  return (
    <Input
      type="text"
      placeholder="Search category name..."
      value={value}
      onChange={onChange}
      className="max-w-sm"
    />
  )
}
