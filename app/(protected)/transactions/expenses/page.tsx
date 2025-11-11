import { Suspense } from "react"
import BasePage from "@/templates/base-page"
import { IExpensePageParams } from "./types"
import ExpenseTable from "./components/expense-table"
import { ExpenseTableSkeleton } from "./components/expense-table/loading"
import { CreateExpenseButton } from "./components/add-expense"
import { CategoryFilter } from "./components/category-filter"
import { CategoryFilterLoading } from "./components/category-filter/loading"
import { WalletFilter } from "./components/wallet-filter"
import { WalletFilterLoading } from "./components/wallet-filter/loading"

interface PageProps {
  searchParams: Promise<IExpensePageParams>
}

export default function TransactionsExpensesPage({ searchParams }: PageProps) {
  return (
    <BasePage
      title="Expenses"
      description="Track and manage your expense transactions"
      searchParams={searchParams}
      searchPlaceholder="Search expense name..."
      createButton={<CreateExpenseButton />}
      tableComponent={<ExpenseTable params={searchParams} />}
      tableLoadingComponent={<ExpenseTableSkeleton />}
      additionalFilters={
        <>
          <Suspense fallback={<CategoryFilterLoading />}>
            <CategoryFilter searchParams={searchParams} />
          </Suspense>
          <Suspense fallback={<WalletFilterLoading />}>
            <WalletFilter searchParams={searchParams} />
          </Suspense>
        </>
      }
    />
  )
}

