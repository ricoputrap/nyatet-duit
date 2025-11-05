import { Suspense } from "react"
import WalletTable from "./components/wallet-table"
import { IWalletPageParams } from "./types"
import WalletTableLoading from "./components/wallet-table/loading"
import SearchInput from "@/components/ui/search-input"
import { CreateWalletButton } from "./components/add-wallet"
import { FormSheet } from "@/components/form-sheet"

export default async function WalletsPage({
  searchParams,
}: {
  searchParams: Promise<IWalletPageParams>
}) {
  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div>
        <h1 className="text-2xl font-bold">Wallets</h1>
        <p className="text-muted-foreground">
          Manage your wallets and accounts
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchInput searchParams={searchParams} placeholder="Search wallets..." />
        <CreateWalletButton />
      </div>

      <Suspense fallback={<WalletTableLoading />}>
        <WalletTable params={searchParams} />
      </Suspense>

      <FormSheet />
    </div>
  )
}
