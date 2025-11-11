import { Suspense } from "react"
import BasePage from "@/templates/base-page"
import { ITransferPageParams } from "./types"
import TransferTable from "./components/transfer-table"
import { LoadingTable } from "./components/transfer-table/loading"
import AddTransfer from "./components/add-transfer"
import { SourceWalletFilter } from "./components/source-wallet-filter"
import { SourceWalletFilterLoading } from "./components/source-wallet-filter/loading"
import { TargetWalletFilter } from "./components/target-wallet-filter"
import { TargetWalletFilterLoading } from "./components/target-wallet-filter/loading"

interface PageProps {
  searchParams: Promise<ITransferPageParams>
}

export default function TransactionsTransferPage({ searchParams }: PageProps) {
  return (
    <BasePage
      title="Transfers"
      description="Track and manage money transfers between wallets"
      searchParams={searchParams}
      searchPlaceholder="Search transfer name..."
      createButton={<AddTransfer />}
      tableComponent={<TransferTable params={searchParams} />}
      tableLoadingComponent={<LoadingTable />}
      additionalFilters={
        <>
          <Suspense fallback={<SourceWalletFilterLoading />}>
            <SourceWalletFilter searchParams={searchParams} />
          </Suspense>
          <Suspense fallback={<TargetWalletFilterLoading />}>
            <TargetWalletFilter searchParams={searchParams} />
          </Suspense>
        </>
      }
    />
  )
}
