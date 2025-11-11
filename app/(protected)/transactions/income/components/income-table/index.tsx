import { getIncomes } from "../../actions"
import { IIncomePageParams } from "../../types"
import { IncomeDataTable } from "./data-table"
import { columns } from "./columns"

interface Props {
  params: Promise<IIncomePageParams>
}

export default async function IncomeTable({ params }: Props) {
  const searchParams = await params
  const incomes = await getIncomes(searchParams)

  return (
    <IncomeDataTable
      columns={columns}
      data={incomes}
      sortKey={searchParams.sortKey}
      sortOrder={searchParams.sortOrder}
    />
  )
}
