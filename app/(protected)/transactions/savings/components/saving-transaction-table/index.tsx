import { getSavingTransactions } from "../../actions"
import { ISavingTransactionPageParams } from "../../types"
import { DataTable } from "./data-table"

interface Props {
  params: Promise<ISavingTransactionPageParams>
}

export default async function SavingTransactionTable({ params }: Props) {
  const searchParams = await params
  const transactions = await getSavingTransactions(searchParams)
  
  return <DataTable data={transactions} />
}
