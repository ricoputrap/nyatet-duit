import { DataTable } from "./data-table"
import { ISavingPageParams } from "../../types"
import { getSavings } from "../../actions"

interface Props {
  params: Promise<ISavingPageParams>
}

export default async function SavingTable({ params }: Props) {
  const searchParams = await params
  const savings = await getSavings(searchParams)
  
  return <DataTable data={savings} />
}
