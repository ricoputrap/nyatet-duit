import { Suspense } from "react"
import WalletFilterSelect from "./wallet-filter"
import { getWallets } from "@/app/(protected)/wallets/actions"
import Loading from "./loading"

export default async function WalletFilter() {
  const wallets = await getWallets({})
  
  return (
    <Suspense fallback={<Loading />}>
      <WalletFilterSelect wallets={wallets} />
    </Suspense>
  )
}
