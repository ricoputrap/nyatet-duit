import { Suspense } from "react"
import { getWallets } from "@/app/(protected)/wallets/actions"
import WalletFilterComponent from "./wallet-filter"
import { Skeleton } from "@/components/ui/skeleton"
import { IExpensePageParams } from "../../types"

interface Props {
  searchParams: Promise<IExpensePageParams>
}

export async function WalletFilter({ searchParams }: Props) {
  const wallets = await getWallets({})

  return (
    <Suspense fallback={<Skeleton className="h-10 w-[180px]" />}>
      <WalletFilterComponent searchParams={searchParams} wallets={wallets} />
    </Suspense>
  )
}
