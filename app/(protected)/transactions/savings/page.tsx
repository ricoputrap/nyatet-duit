import { Suspense } from "react"
import BasePage from "@/templates/base-page"
import { ISavingTransactionPageParams } from "./types"
import SavingTransactionTable from "./components/saving-transaction-table"
import SavingTransactionTableLoading from "./components/saving-transaction-table/loading"
import { CreateSavingTransactionButton } from "./components/add-saving-transaction"
import { GoalFilter } from "./components/goal-filter"
import { GoalFilterLoading } from "./components/goal-filter/loading"
import { WalletFilter } from "./components/wallet-filter"
import { WalletFilterLoading } from "./components/wallet-filter/loading"

interface PageProps {
  searchParams: Promise<ISavingTransactionPageParams>
}

export default function TransactionsSavingsPage({ searchParams }: PageProps) {
  return (
    <BasePage
      title="Savings"
      description="Track and manage your saving transactions"
      searchParams={searchParams}
      createButton={<CreateSavingTransactionButton />}
      tableComponent={<SavingTransactionTable params={searchParams} />}
      tableLoadingComponent={<SavingTransactionTableLoading />}
      additionalFilters={
        <>
          <Suspense fallback={<GoalFilterLoading />}>
            <GoalFilter searchParams={searchParams} />
          </Suspense>
          <Suspense fallback={<WalletFilterLoading />}>
            <WalletFilter searchParams={searchParams} />
          </Suspense>
        </>
      }
    />
  )
}
