import { Suspense } from "react"
import BasePage from "@/templates/base-page"
import { IIncomePageParams } from "./types"
import IncomeTable from "./components/income-table"
import { IncomeTableSkeleton } from "./components/income-table/loading"
import { CreateIncomeButton } from "./components/add-income"
import { WalletFilter } from "./components/wallet-filter"
import { WalletFilterLoading } from "./components/wallet-filter/loading"

interface PageProps {
  searchParams: Promise<IIncomePageParams>
}

export default function TransactionsIncomePage({ searchParams }: PageProps) {
  return (
    <BasePage
      title="Income"
      description="Track and manage your income transactions"
      searchParams={searchParams}
      searchPlaceholder="Search income name..."
      createButton={<CreateIncomeButton />}
      tableComponent={<IncomeTable params={searchParams} />}
      tableLoadingComponent={<IncomeTableSkeleton />}
      additionalFilters={
        <Suspense fallback={<WalletFilterLoading />}>
          <WalletFilter searchParams={searchParams} />
        </Suspense>
      }
    />
  )
}
