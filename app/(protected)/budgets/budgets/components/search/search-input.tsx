"use client";

import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

interface Props {
  searchValue: string;
}

export default function SearchInput({ searchValue }: Props) {
  const router = useRouter()
  const [value, setValue] = useState<string>(searchValue || '')

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
      placeholder="Search category name..."
      value={value}
      onChange={onChange}
      className="pl-9"
    />
  )
}
