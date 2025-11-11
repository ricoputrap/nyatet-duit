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

interface CategoryFilterProps {
  searchParams: Promise<{
    category_id?: string
  }>
  categories: { id: string; name: string }[]
}

function CategoryFilterComponent({
  searchParams,
  categories
}: CategoryFilterProps) {
  const params = use(searchParams)
  const router = useRouter()

  const handleValueChange = (value: string) => {
    const urlParams = new URLSearchParams(window.location.search)
    
    if (value === "all") {
      urlParams.delete('category_id')
    } else {
      urlParams.set('category_id', value)
    }
    
    router.replace(`?${urlParams.toString()}`)
  }

  return (
    <Select
      value={params.category_id || "all"}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default CategoryFilterComponent
