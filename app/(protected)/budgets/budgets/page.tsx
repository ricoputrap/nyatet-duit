import { Suspense } from "react"
import { SearchBudget } from "./components/search"
import { DateFilter } from "./components/date-filter"
import { CreateBudgetButton } from "./components/add-budget"
import { BudgetFormSheet } from "./components/budget-form-sheet"
import { BudgetTableWrapper } from "./components/budget-table-wrapper"
import { BudgetTableSkeleton } from "./components/budget-table/loading"
import { IBudgetPageParams } from "./types"

interface PageProps {
  searchParams: Promise<IBudgetPageParams>
}

export default function BudgetsPage({ searchParams }: PageProps) {
  return (
    <div className="py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Budgets</h1>
          <p className="text-muted-foreground">Manage your budget allocations</p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Suspense fallback={<div className="h-10 w-32 bg-muted animate-pulse rounded-md" />}>
              <DateFilter searchParams={searchParams} />
            </Suspense>
            <Suspense fallback={<div className="h-10 flex-1 max-w-sm bg-muted animate-pulse rounded-md" />}>
              <SearchBudget searchParams={searchParams} />
            </Suspense>
          </div>
          <CreateBudgetButton />
        </div>

        <Suspense fallback={<BudgetTableSkeleton />}>
          <BudgetTableWrapper searchParams={searchParams} />
        </Suspense>
      </div>

      <BudgetFormSheet />
    </div>
  )
}
