import { Suspense } from "react"
import { getWallets } from "@/app/(protected)/wallets/actions"
import SourceWalletFilterComponent from "./source-wallet-filter"
import { Skeleton } from "@/components/ui/skeleton"
import { ITransferPageParams } from "../../types"

interface Props {
  searchParams: Promise<ITransferPageParams>
}

export async function SourceWalletFilter({ searchParams }: Props) {
  const wallets = await getWallets({})

  return (
    <Suspense fallback={<Skeleton className="h-10 w-[180px]" />}>
      <SourceWalletFilterComponent searchParams={searchParams} wallets={wallets} />
    </Suspense>
  )
}
