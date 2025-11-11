import { Suspense } from "react"
import GoalFilterSelect from "./goal-filter"
import { GoalFilterLoading } from "./loading"
import { getSavings } from "@/app/(protected)/savings/actions"
import { ISavingTransactionPageParams } from "../../types"

interface Props {
  searchParams: Promise<ISavingTransactionPageParams>
}

export async function GoalFilter({ searchParams }: Props) {
  const savings = await getSavings({})
  
  return (
    <Suspense fallback={<GoalFilterLoading />}>
      <GoalFilterSelect savings={savings} />
    </Suspense>
  )
}
