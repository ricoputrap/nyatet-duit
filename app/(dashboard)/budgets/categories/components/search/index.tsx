"use client"

import React, { use } from 'react'
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { ICategoryPageParams } from '../../types'

interface SearchProps {
  searchParams: Promise<ICategoryPageParams>
}

export default function Search({ searchParams }: SearchProps) {
  const params = use(searchParams)
  const router = useRouter()
  const [value, setValue] = React.useState(params.search || '')

  const handleSearch = useDebouncedCallback((term: string) => {
    const urlParams = new URLSearchParams(window.location.search)
    
    if (term) {
      urlParams.set('search', term)
    } else {
      urlParams.delete('search')
    }
    
    router.replace(`?${urlParams.toString()}`)
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
