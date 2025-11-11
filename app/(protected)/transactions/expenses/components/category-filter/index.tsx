import { Suspense } from "react"
import { getCategories } from "@/app/(protected)/budgets/categories/actions"
import CategoryFilterComponent from "./category-filter"
import { Skeleton } from "@/components/ui/skeleton"
import { IExpensePageParams } from "../../types"

interface Props {
  searchParams: Promise<IExpensePageParams>
}

export async function CategoryFilter({ searchParams }: Props) {
  const categories = await getCategories({})

  return (
    <Suspense fallback={<Skeleton className="h-10 w-[180px]" />}>
      <CategoryFilterComponent searchParams={searchParams} categories={categories} />
    </Suspense>
  )
}
