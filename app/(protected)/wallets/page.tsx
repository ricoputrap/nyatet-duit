import WalletTable from "./components/wallet-table"
import { IWalletPageParams } from "./types"
import WalletTableLoading from "./components/wallet-table/loading"
import { CreateWalletButton } from "./components/add-wallet"
import BasePage from "@/templates/base-page"

export default async function WalletsPage({
  searchParams,
}: {
  searchParams: Promise<IWalletPageParams>
}) {
  return (
    <BasePage
      title="Wallets"
      description="Manage your wallets and accounts"
      searchParams={searchParams}
      searchPlaceholder="Search wallets..."
      createButton={<CreateWalletButton />}
      tableComponent={<WalletTable params={searchParams} />}
      tableLoadingComponent={<WalletTableLoading />}
    />
  )
}
