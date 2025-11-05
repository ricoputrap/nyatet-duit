import { Suspense } from "react"
import { DateFilter } from "./components/date-filter"
import { CreateBudgetButton } from "./components/add-budget"
import { BudgetTableWrapper } from "./components/budget-table-wrapper"
import { BudgetTableSkeleton } from "./components/budget-table/loading"
import { DateFilterLoading } from "./components/date-filter/loading"
import { IBudgetPageParams } from "./types"
import BasePage from "@/templates/base-page"

interface PageProps {
  searchParams: Promise<IBudgetPageParams>
}

export default function BudgetsPage({ searchParams }: PageProps) {
  return (
    <BasePage
      title="Budgets"
      description="Manage your budget allocations"
      searchParams={searchParams}
      searchPlaceholder="Search budgets..."
      createButton={<CreateBudgetButton />}
      tableComponent={<BudgetTableWrapper searchParams={searchParams} />}
      tableLoadingComponent={<BudgetTableSkeleton />}
      additionalFilters={
        <Suspense fallback={<DateFilterLoading />}>
          <DateFilter searchParams={searchParams} />
        </Suspense>
      }
    />
  )
}
