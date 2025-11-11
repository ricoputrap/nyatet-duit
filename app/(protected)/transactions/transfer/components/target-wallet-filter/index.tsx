import { Suspense } from "react"
import { getWallets } from "@/app/(protected)/wallets/actions"
import TargetWalletFilterComponent from "./target-wallet-filter"
import { Skeleton } from "@/components/ui/skeleton"
import { ITransferPageParams } from "../../types"

interface Props {
  searchParams: Promise<ITransferPageParams>
}

export async function TargetWalletFilter({ searchParams }: Props) {
  const wallets = await getWallets({})

  return (
    <Suspense fallback={<Skeleton className="h-10 w-[180px]" />}>
      <TargetWalletFilterComponent searchParams={searchParams} wallets={wallets} />
    </Suspense>
  )
}
