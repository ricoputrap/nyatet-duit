import React, { Suspense } from 'react'
import SearchInput from "@/components/ui/search-input"
import { FormSheet } from "@/components/form-sheet"

interface BasePageProps<T = { search?: string | undefined }> {
  title: string
  description: string
  searchParams: Promise<T>
  searchPlaceholder?: string
  createButton: React.ReactNode
  tableComponent: React.ReactNode
  tableLoadingComponent: React.ReactNode
  additionalFilters?: React.ReactNode
}

export default function BasePage<T extends { search?: string | undefined } = { search?: string | undefined }>({
  title,
  description,
  searchParams,
  searchPlaceholder = "Search...",
  createButton,
  tableComponent,
  tableLoadingComponent,
  additionalFilters,
}: BasePageProps<T>) {
  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          {additionalFilters}
          <SearchInput searchParams={searchParams} placeholder={searchPlaceholder} />
        </div>
        {createButton}
      </div>

      <Suspense fallback={tableLoadingComponent}>
        {tableComponent}
      </Suspense>

      <FormSheet />
    </div>
  )
}
