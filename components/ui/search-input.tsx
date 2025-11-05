"use client"

import React, { Suspense, use } from 'react'
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Skeleton } from './skeleton'

interface SearchProps {
  searchParams: Promise<{
    search?: string,
  }>
  placeholder?: string;
}

function Search({
  searchParams,
  placeholder = "Search..."
}: SearchProps) {
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
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="max-w-sm"
    />
  )
}

export default function SearchInput(props: SearchProps) {
  return (
    <Suspense fallback={<Skeleton className="h-10 w-full max-w-sm" />}>
      <Search {...props} />
    </Suspense>
  )
}