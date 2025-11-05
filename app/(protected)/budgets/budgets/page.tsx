import { Suspense } from "react"
import SearchInput from "@/components/ui/search-input"
import { DateFilter } from "./components/date-filter"
import { CreateBudgetButton } from "./components/add-budget"
import { FormSheet } from "@/components/form-sheet"
import { BudgetTableWrapper } from "./components/budget-table-wrapper"
import { BudgetTableSkeleton } from "./components/budget-table/loading"
import { DateFilterLoading } from "./components/date-filter/loading"
import { IBudgetPageParams } from "./types"

interface PageProps {
  searchParams: Promise<IBudgetPageParams>
}

export default function BudgetsPage({ searchParams }: PageProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div>
        <h1 className="text-2xl font-bold">Budgets</h1>
        <p className="text-muted-foreground">Manage your budget allocations</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Suspense fallback={<DateFilterLoading />}>
            <DateFilter searchParams={searchParams} />
          </Suspense>
          <SearchInput searchParams={searchParams} placeholder="Search budgets..." />
        </div>
        <CreateBudgetButton />
      </div>

      <Suspense fallback={<BudgetTableSkeleton />}>
        <BudgetTableWrapper searchParams={searchParams} />
      </Suspense>

      <FormSheet />
    </div>
  )
}
