import { Suspense } from "react"
import WalletFilterSelect from "./wallet-filter"
import { WalletFilterLoading } from "./loading"
import { getWallets } from "@/app/(protected)/wallets/actions"
import { ISavingTransactionPageParams } from "../../types"

interface Props {
  searchParams: Promise<ISavingTransactionPageParams>
}

export async function WalletFilter({ searchParams }: Props) {
  const wallets = await getWallets({})
  
  return (
    <Suspense fallback={<WalletFilterLoading />}>
      <WalletFilterSelect wallets={wallets} />
    </Suspense>
  )
}
