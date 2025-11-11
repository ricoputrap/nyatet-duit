import { getExpenses } from "../../actions"
import { IExpensePageParams } from "../../types"
import { ExpenseDataTable } from "./data-table"
import { columns } from "./columns"

interface Props {
  params: Promise<IExpensePageParams>
}

export default async function ExpenseTable({ params }: Props) {
  const searchParams = await params
  const expenses = await getExpenses(searchParams)

  return (
    <ExpenseDataTable
      columns={columns}
      data={expenses}
      sortKey={searchParams.sortKey}
      sortOrder={searchParams.sortOrder}
    />
  )
}
